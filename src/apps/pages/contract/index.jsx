import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Form,
  Tooltip,
  PageHeader,
  Statistic,
  DatePicker,
} from "antd";
import { contractPage } from "@Api/contract.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { salesmanList } from "@Api/set_user";

const { RangePicker } = DatePicker;
function MsgCooprate() {
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [salerList, setSalerList] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState("");
  const [searchForm] = Form.useForm();
  let navigate = useNavigate();
  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);

  useEffect(() => {
    getSalesmanList();
  }, []);

  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
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
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYYMMDD");
      values.endTime = moment(values.time[1]).format("YYYYMMDD");
    }
    if (values.userIdList) values.userIdList = [values.userIdList];
    contractPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
    }).then((res) => {
      setData(res.data);
      setTotal(res.additional_data.total);
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
      title: "合同类型",
      dataIndex: "type",
      key: "type",
    },

    {
      title: "合同编号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "合同名称",
      dataIndex: "name",
      key: "name",
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: "客户名称",
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
      title: "合同金额",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "已收金额",
      dataIndex: "receivedValue",
      key: "receivedValue",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "未收金额",
      dataIndex: "unreceivedValue",
      key: "unreceivedValue",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "签约日期",
      dataIndex: "signedDate",
      key: "signedDate",
    },
    {
      title: "销售人员",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },
    {
      title: "建档日期",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "合同条款",
      dataIndex: "term",
      key: "term",
      ellipsis: {
        showTitle: false,
      },
      render: (term) => (
        <Tooltip placement="topLeft" title={term}>
          {term}
        </Tooltip>
      ),
    },
    {
      title: "合同附件",
      key: "filePath",
      fixed: "right",
      render: (value, record) => (
        <Space>
          <a href={record.filePath} download={record.name}></a>
        </Space>
      ),
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

  return (
    <div>
      <PageHeader className="site-page-header" title="合同管理" />
      <div className="search">
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          initialValues={{
            time: [moment().startOf("year"), moment()],
          }}
        >
          <Form.Item label="" name="name">
            <Input
              placeholder="请输入商机名称、合同名称、合同编号"
              style={{ width: 240 }}
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
          <Form.Item label="" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>

        <div>
          总计合同额:
          <Statistic value={total} valueStyle={{ fontSize: "12px" }} />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
      {/* 弹出表单 */}
    </div>
  );
}

export default MsgCooprate;
