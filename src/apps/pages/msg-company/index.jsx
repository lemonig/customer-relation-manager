import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  PageHeader,
} from "antd";
import {
  companyInfo,
  companyDelete,
  companyUpdate,
  companyAdd,
} from "@Api/info_company.js";
import { tianyancha } from "@Api/public.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { organize } from "@Utils/data";

const { Option } = Select;

function MsgCompany() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operateId, setOperateId] = useState(null); //正在操作id
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchVal, setSearchVal] = useState("");
  const [selectVal, setSelectVal] = useState("1");
  const [data, setData] = useState([]);
  const [tycList, setTycList] = useState([]);
  const [tycCompany, setTycCompany] = useState([]);

  useEffect(() => {
    getPageData();
    JSON.stringify(pageMsg);
  }, [JSON.stringify(pageMsg)]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // 查询
  const search = () => {
    // FIXME 第一页会不触发hooks,故分开
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
    companyInfo({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        name: searchVal,
        orgType: selectVal,
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
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法回复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await companyDelete({ id });
        if (success) {
          message.success("删除成功");
          setIsModalOpen(false);
          getPageData();
        } else {
          message.error("删除失败");
        }
      },
    });
  };
  // 新建
  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  // 编辑
  const handleEdit = (record) => {
    setOperateId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    // values.extraData = setLoading(true);
    // 编辑
    if (operateId) {
      values.id = operateId;
      let { success, message: msg } = await companyUpdate(values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
      setOperateId(null);
    } else {
      let { success, message: msg } = await companyAdd(values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
    }
    // 添加
    getPageData();
    setLoading(false);
  };

  // 弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false);
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
      title: "客户名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "机构类型",
      dataIndex: "orgType",
      key: "orgType",
      render: (value) => {
        let res = organize.filter((ele) => ele.value == value);
        return res[0].label;
      },
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
      title: "统一社会信用代码",
      dataIndex: "creditCode",
      key: "creditCode",
    },
    {
      title: "备注",
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
      title: "创建用户",
      dataIndex: "createUserName",
      key: "createUserName",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
    },
    {
      title: "操作",
      key: "operation",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDel(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchVal(value);
  };
  const handleSelectChange = (value) => {
    setSelectVal(value);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  // 工商信息搜索
  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue, setTycList);
    } else {
      setTycList([]);
    }
  };
  const handleChange = (_, option) => {
    form.setFieldsValue({
      ...option,
      orgType: option.companyType,
    });
  };

  return (
    <div>
      <PageHeader className="site-page-header" title="客户公司" />
      <div className="search">
        <Space>
          <Input
            placeholder="请输入客户名称"
            style={{ width: 240 }}
            // value={searchVal}
            onChange={handleInputChange}
          />
          <Select
            style={{ width: 120 }}
            onChange={handleSelectChange}
            options={organize}
            placeholder="机构类型"
            allowClear
          />
          <Button type="primary" onClick={search}>
            查询
          </Button>
          <Button onClick={handleAdd}>新建</Button>
        </Space>
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
      <Modal
        title={operateId ? "编辑" : "新建"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="客户名称"
            name="name"
            rules={[{ required: true, message: "请输入客户名称!" }]}
          >
            <Select
              showSearch
              placeholder="请输入"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
              fieldNames={{
                label: "name",
                value: "creditCode",
              }}
              options={tycList}
            />
          </Form.Item>
          <Form.Item label="机构类型" name="orgType">
            <Select
              placeholder="请选择机构"
              options={organize}
              disabled
            ></Select>
          </Form.Item>
          <Form.Item label="统一社会信用代码" name="creditCode">
            <Input disabled placeholder="请输入" />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="备注" name="description">
            <Input.TextArea placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MsgCompany;

let timeout;
let currentValue;

const fetch = (value, callback) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  const fake = async () => {
    let { data } = await tianyancha({
      keyword: value,
    });
    if (currentValue === value) {
      callback(data);
    }
  };
  timeout = setTimeout(fake, 300);
};
