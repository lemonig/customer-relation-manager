import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Table,
  Form,
  Tooltip,
  PageHeader,
  Statistic,
  Modal,
  message,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { saleList } from "@Api/set_sale";
import { salesmanList } from "@Api/set_user";
import { approvalPage, approveOperate } from "@Api/deal_list";
import { deptList as deptListApi } from "@Api/set_dept.js";
import FormConfirm from "./components/FormConfirm";

const { Option } = Select;

function DealConfirm() {
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //表格选中key
  const [searchForm] = Form.useForm();
  const [pipeline, setPipeline] = useState([]); //销售流程
  const [salerList, setSalerList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let navigate = useNavigate();
  useEffect(() => {
    getPlpeline();
    getSalesmanList();
    getDeptList();
  }, []);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);
  //销售流程
  const getPlpeline = async () => {
    let { data } = await saleList();
    searchForm.setFieldValue("pipelineId", data[0]?.id);
    setPipeline(data);
  };
  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };
  //部门
  const getDeptList = async () => {
    let { data } = await deptListApi();
    setDeptList(data);
  };

  // 查询
  const search = () => {
    if (pageMsg.pagination.current === 1) {
      getPageData();
    } else {
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          current: 1,
        },
      });
    }
  };
  const getPageData = () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();

    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    if (values.userIdList) values.userIdList = [values.userIdList];
    if (values.statusList) values.statusList = [values.statusList];
    if (values.approveStatusList)
      values.approveStatusList = [values.approveStatusList];
    if (values.valueList) values.valueList = values.valueList.split(",");
    approvalPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
    }).then((res) => {
      setData(res.data);
      setLoading(false);
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          total: res.additional_data.pagination.total,
        },
      });
    });
  };

  const gotoDealDetail = (id) => {
    navigate({
      pathname: "/pipeline",
      search: `?pipelineId=${id}`,
    });
  };

  // 表格选中
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    // setSelecteTable(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
    },
    {
      title: "商机编号",
      dataIndex: "dealCode",
      key: "dealCode",
      render: (value, record) => (!!value ? <a>{value}</a> : ""),
      onCell: (record) => ({
        onClick: (event) => {
          if (record.dealId) {
            gotoDealDetail(record.dealId);
          }
        },
      }),
    },
    {
      title: "商机名称",
      dataIndex: "dealName",
      key: "dealName",
      ellipsis: {
        showTitle: false,
      },
      render: (dealName) => (
        <Tooltip placement="topLeft" title={dealName}>
          {dealName}
        </Tooltip>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "dealCreateTime",
      key: "dealCreateTime",
    },
    {
      title: "预算金额",
      dataIndex: "dealValue",
      key: "dealValue",
      render: (dealValue, record) => (
        <Statistic value={dealValue} valueStyle={{ fontSize: "12px" }} />
      ),
    },

    {
      title: "客户公司",
      dataIndex: "orgName",
      key: "orgName",
      ellipsis: {
        showTitle: false,
      },
      render: (orgName) => (
        <Tooltip placement="topLeft" title={orgName}>
          {orgName}
        </Tooltip>
      ),
    },

    {
      title: "销售人员",
      dataIndex: "dealOwnerUserName",
      key: "dealOwnerUserName",
    },

    {
      title: "最近跟进时间",
      dataIndex: "latestFollowUpTime",
      key: "latestFollowUpTime",
    },
    {
      title: "商机状态变更",
      dataIndex: "actionTypeName",
      key: "actionTypeName",
    },
    {
      title: "申请时间",
      dataIndex: "actionTime",
      key: "actionTime",
    },
    {
      title: "审核人",
      dataIndex: "approveIdName",
      key: "approveIdName",
    },
    {
      title: "确认状态",
      dataIndex: "statusName",
      key: "statusName",
    },
    {
      title: "确认结果",
      dataIndex: "approveStatusName",
      key: "approveStatusName",
    },
    {
      title: "备注",
      dataIndex: "approveDescription",
      key: "approveDescription",
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  const handleConfirm = () => {
    setIsModalOpen(true);
  };
  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) {
      getPageData();
      setSelectedRowKeys([]);
    }
  };
  return (
    <div>
      <PageHeader className="site-page-header" title="商机确认" />
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="pipelineId">
            <Select
              style={{ width: 120 }}
              placeholder="销售流程"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              options={pipeline}
            />
          </Form.Item>
          <Form.Item label="" name="deptIdList">
            <Select
              style={{ width: 120 }}
              options={deptList}
              placeholder="选择部门"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
            />
          </Form.Item>
          <Form.Item label="" name="userIdList">
            <Select
              style={{ width: 120 }}
              options={salerList}
              placeholder="销售人员"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
            />
          </Form.Item>
          {/* <Form.Item label="" name="valueList">
            <Select
              style={{ width: 120 }}
              options={[
                {
                  label: "1000万以上",
                  value: "10000000",
                },
                {
                  label: "500~1000万",
                  value: "5000000,10000000",
                },
                {
                  label: "100~500万",
                  value: "1000000,5000000",
                },
                {
                  label: "0~100万",
                  value: "0,1000000",
                },
              ]}
              placeholder="预算金额"
              allowClear
            />
          </Form.Item> */}
          <Form.Item label="" name="dealStatusList">
            <Select
              style={{ width: 120 }}
              options={[
                // {
                //   label: "进行中",
                //   value: "1",
                // },
                {
                  label: "赢单",
                  value: "2",
                },
                {
                  label: "输单",
                  value: "3",
                },
                {
                  label: "终止",
                  value: "4",
                },
              ]}
              placeholder="商机状态"
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>

          <Form.Item label="" name="statusList">
            <Select
              style={{ width: 120 }}
              placeholder="确认状态"
              options={[
                {
                  label: "待确认",
                  value: "1",
                },
                {
                  label: "已确认",
                  value: "2",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="" name="approveStatusList">
            <Select
              style={{ width: 120 }}
              placeholder="确认状态"
              options={[
                {
                  label: "同意",
                  value: "1",
                },
                {
                  label: "不同意",
                  value: "2",
                },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            {selectedRowKeys.length > 0 ? (
              <Button onClick={handleConfirm}>确认</Button>
            ) : null}
          </Form.Item>
        </Form>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          ...pageMsg.pagination,
        }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        rowSelection={rowSelection}
      />
      {/* 弹出表单 */}
      {isModalOpen && (
        <FormConfirm
          open={isModalOpen}
          closeModal={closeModal}
          operate={selectedRowKeys}
        />
      )}
    </div>
  );
}

export default DealConfirm;
