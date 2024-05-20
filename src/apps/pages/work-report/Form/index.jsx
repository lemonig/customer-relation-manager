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
} from "antd";
import { workreportAdd } from "@Api/work_report";

import { activeList } from "@Api/set_active.js";
import moment from "moment";
import IconFont from "@Components/IconFont";
import { actPage, actDelete, actExport, actUpdate } from "@Api/act_adm.js";
const { RangePicker } = DatePicker;

function FormRep({ open, closeModal }) {
  const [activeData, setActiveData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //表格选中key
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [searchForm] = Form.useForm();
  useEffect(() => {
    getActiveData();
  }, []);
  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);
  const getActiveData = async () => {
    setLoading(true);
    let { data } = await activeList();
    let list = data.map((item) => ({
      text: item.name,
      value: item.id,
    }));
    setActiveData(list);
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
      sort: pageMsg.order ? [`${pageMsg.field},${pageMsg.order}`] : undefined,
      data: {
        ...values,
        typeIdList: pageMsg?.filters?.typeName,
        statusList: pageMsg?.filters?.status,
      },
    }).then((res) => {
      setData(res.data.filter((ele) => ele.status === "2"));
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

  const columns = [
    {
      title: "状态",
      dataIndex: "statusName",
      key: "status",
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
    // {
    //   title: "联系人电话",
    //   dataIndex: "personPhone",
    //   key: "personPhone",
    // },
    {
      title: "任务开始时间",
      dataIndex: "startTime",
      key: "startTime",
      sorter: true,
    },
    {
      title: "任务描述",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
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
      dataIndex: "participantName",
      key: "participantName",
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
  const handleOk = async () => {
    setLoading(false);
    let { success, message: msg } = await workreportAdd({
      activityIdList: selectedRowKeys,
    });
    if (success) {
      message.success("提交成功");
      closeModal(true);
    } else {
      message.error(msg);
    }
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    // if filters not changed, don't update pagination.current

    setPagemsg({
      pagination,
      filters,
      ...sorter,
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

  return (
    <div>
      <Modal
        title="新建工作报告"
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        destroyOnClose
        width={1200}
        confirmLoading={loading}
      >
        <div className="search">
          <Form layout="inline" form={searchForm} onFinish={search}>
            <Form.Item label="" name="name">
              <Input
                placeholder="请输入商机名称、任务编号、任务名称"
                style={{ width: 300 }}
                // value={searchVal}
              />
            </Form.Item>
            <Form.Item label="" name="time">
              <RangePicker />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
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
      </Modal>
    </div>
  );
}

export default FormRep;
