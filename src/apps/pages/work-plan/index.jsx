import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Space,
  Table,
  Modal,
  message,
  PageHeader,
  DatePicker,
  Form,
  Select,
  Tooltip,
} from "antd";
import { actPage, actDelete, actExport, actUpdate } from "@Api/act_adm.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ActForm from "./Form/ActForm";
import moment from "moment";
import { activeList } from "@Api/set_active.js";
import { salesmanList } from "@Api/set_user";
import IconFont from "@Components/IconFont";
import "./index.less";
import BtnAuth from "@Shared/BtnAuth";
const { RangePicker } = DatePicker;

function WorkPlan() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //表格选中key
  const [selectedTable, setSelecteTable] = useState([]); //表格选中staff
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [salerList, setSalerList] = useState([]);
  const [searchForm] = Form.useForm();
  let navigate = useNavigate();

  useEffect(() => {
    getSalesmanList();
    getActiveData();
  }, []);
  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);

  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };

  const getActiveData = async () => {
    setLoading(true);
    let { data } = await activeList();
    let list = data.map((item) => ({
      text: item.name,
      value: item.id,
    }));
    setActiveData(list);
  };
  //转变完成状态
  const handleChangeOver = async (id, val) => {
    let { success, message: msg } = await actUpdate({
      id: id,
      done: !val,
    });
    if (success) {
      message.success("更新成功！");
      search();
    } else {
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "完成",
      dataIndex: "done",
      key: "done",
      render: (down, record) =>
        down ? (
          <IconFont
            iconName="wancheng"
            color="#DEDEDE"
            style={{ cursor: "pointer" }}
            size={18}
            onClick={() => handleChangeOver(record.id, down)}
          />
        ) : (
          <IconFont
            iconName="weikao"
            color="#DEDEDE"
            style={{ cursor: "pointer" }}
            size={16}
            onClick={() => handleChangeOver(record.id, down)}
          />
        ),
    },

    {
      title: "状态",
      dataIndex: "statusName",
      key: "status",
      filters: [
        {
          text: "代办",
          value: "1",
        },
        {
          text: "已完成",
          value: "2",
        },
      ],
    },
    {
      title: "任务编号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "任务类型",
      dataIndex: "typeName",
      key: "typeName",
      filters: activeData,
    },
    // {
    //   title: "任务主题",
    //   dataIndex: "subject",
    //   key: "subject",
    // },
    {
      title: "客户联系人",
      dataIndex: "personName",
      key: "personName",
    },
    {
      title: "联系人电话",
      dataIndex: "personPhone",
      key: "personPhone",
    },
    {
      title: "任务开始时间",
      dataIndex: "startTime",
      key: "startTime",
      sorter: true,
    },
    {
      title: "任务描述",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "商机名称",
      key: "dealName",
      render: (row) => row.deal.name,
    },
    // {
    //   title: "客户公司",
    //   dataIndex: "orgName",
    //   key: "orgName",
    // },
    {
      title: "参与人员",
      dataIndex: "participant",
      key: "participant",
    },

    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },

    {
      title: "创建用户",
      dataIndex: "createUserName",
      key: "createUserName",
    },

    // {
    //   title: "操作",
    //   key: "operation",
    //   fixed: "right",
    //   render: (_, record) => (
    //     <Space>
    //       <a onClick={() => handleEdit(record)}>编辑</a>
    //     </Space>
    //   ),
    // },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  // 新建
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  // 编辑
  const handleEdit = () => {
    setIsModalOpen(true);
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
    setSelectedRowKeys([]);
    setSelecteTable([]);
  };
  const getPageData = () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYYMMDD");
      values.endTime = moment(values.time[1]).format("YYYYMMDD");
    }
    actPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      sort: pageMsg?.order
        ? [pageMsg?.columnKey, pageMsg?.order.substring(0, 3)]
        : undefined,
      data: {
        ...values,
        typeIdList: pageMsg?.filters?.typeName,
        statusList: pageMsg?.filters?.status,
      },
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

  // 删除
  const handleDel = () => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "是否删除?",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await actDelete({
          idList: selectedRowKeys,
        });
        if (success) {
          resetTable();
        }
        message.success(msg);
      },
    });
  };

  // 弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const gotoLinkPeople = (record) => {
    navigate({
      pathname: "/msgCoopratePeople",
      search: `?linkId=${record.id}&linkName=${record.name}`,
    });
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    // if filters not changed, don't update pagination.current

    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };
  //

  // 表格转态初始化
  const resetTable = () => {
    setSelectedRowKeys([]);
    setSelecteTable([]);
    getPageData();
  };
  // 表格选中
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelecteTable(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
  };
  //导出
  const download = () => {
    actExport(
      {
        idList: selectedRowKeys,
      },
      "任务导出"
    );
  };

  return (
    <div>
      <PageHeader className="site-page-header" title="销售计划" />
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="name">
            <Input
              placeholder="请输入商机名称、任务编号、任务名称、客户公司"
              style={{ width: 300 }}
              // value={searchVal}
            />
          </Form.Item>
          <Form.Item label="" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item label="" name="userIdList">
            <Select
              style={{ width: 200 }}
              options={salerList}
              placeholder="销售人员"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={download}>导出</Button>
              {selectedRowKeys.length === 0 ? (
                <BtnAuth word="activity:workplan:create">
                  <Button onClick={handleAdd}>新建</Button>
                </BtnAuth>
              ) : null}
              {selectedRowKeys.length > 0 ? (
                <Button onClick={handleDel}>删除</Button>
              ) : null}
              {selectedRowKeys.length === 1 ? (
                <Button onClick={handleEdit}>编辑</Button>
              ) : null}
            </Space>
          </Form.Item>
        </Form>
      </div>
      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={data}
        loading={loading}
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        title={() => (
          <div style={{ textAlign: "right", fontSize: "12px" }}>
            共{pageMsg.pagination.total}项数据
          </div>
        )}
        onHeaderCell={() => "onHeaderCell"}
        rowClassName={(record, index) => {
          if (record.status == 1) {
          } else if (record.status == 3) {
            return "red";
          } else if (record.status == 2) {
            return "gray";
          } else {
          }
        }}
      />
      {/* 弹出表单 */}
      {isModalOpen && (
        <ActForm
          isModalOpen={isModalOpen}
          record={selectedTable[0]}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default WorkPlan;
