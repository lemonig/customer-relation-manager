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
  agentInfo,
  agentDelete,
  agentUpdate,
  agentAdd,
} from "@Api/info_agent.js";
import { tianyancha } from "@Api/public.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { organize } from "@Utils/data";
const { Option } = Select;

function MsgAgent() {
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
  const [data, setData] = useState([]);
  const [tycList, setTycList] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);

  const showModal = () => {
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
  };
  const getPageData = () => {
    setLoading(true);
    agentInfo({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        name: searchVal,
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
        let { success, message: msg } = await agentDelete({ id });
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
    setLoading(true);
    // 编辑
    if (operateId) {
      values.id = operateId;
      let { success, message: msg } = await agentUpdate(values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
      setOperateId(null);
    } else {
      let { success, message: msg } = await agentAdd(values);
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
  const gotoLink = (record) => {
    navigate({
      pathname: "/msgAgentLink",
      search: `?agentId=${record.id}&agentName=${record.name}`,
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
      title: "公司名称",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "地址",
      dataIndex: "address",
      key: "address",
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
      title: "联系人",
      width: 100,
      dataIndex: "personNum",
      key: "personNum",
      render: (value, record) => (
        <Space>
          <a>{value}</a>
        </Space>
      ),
      onCell: (record) => ({
        onClick: (event) => {
          console.log(record);
          gotoLink(record);
        },
      }),
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
      <div className="search">
        <PageHeader className="site-page-header" title="招标代理" />
        <Space>
          <Input
            placeholder="请输入公司名称"
            style={{ width: 240 }}
            // value={searchVal}
            onChange={handleInputChange}
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
          initialValues={{
            orgType: "1",
          }}
          form={form}
        >
          <Form.Item
            label="公司名称"
            name="name"
            rules={[{ required: true, message: "请输入公司名称!" }]}
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

export default MsgAgent;
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
