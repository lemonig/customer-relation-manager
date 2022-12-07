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
  Typography,
  Tooltip,
  PageHeader,
} from "antd";
import {
  customerInfo,
  customerDelete,
  customerUpdate,
  customerAdd,
} from "@Api/info_customer.js";
import { ExclamationCircleOutlined, DownOutlined } from "@ant-design/icons";
import LinkCustomer from "@Shared/LinkCustomer";
const { Option } = Select;

function MsgCustomer() {
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
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkSelected, setLinkSelected] = useState({});

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
    customerInfo({
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
        let { success, message: msg } = await customerDelete({ id });
        if (success) {
          message.success("删除成功");
          setIsModalOpen(false);
          getPageData();
        } else {
          message.error(msg);
        }
      },
    });
  };
  // 新建
  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
    setLinkSelected({});
  };
  // 编辑
  const handleEdit = (record) => {
    setOperateId(record.id);
    form.setFieldsValue(record);
    setLinkSelected({
      id: record.orgId,
      name: record.orgName,
    });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // values.orgId = linkSelected.id;
    // 编辑
    if (operateId) {
      values.id = operateId;
      let { success, message: msg } = await customerUpdate(values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
      setOperateId(null);
    } else {
      let { success, message: msg } = await customerAdd(values);
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
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "电子邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      render: (val) => (val == 1 ? "男" : "女"),
    },
    {
      title: "客户名称",
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: "部门",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "职位",
      dataIndex: "jotTitle",
      key: "jotTitle",
    },
    {
      title: "关键决策人",
      dataIndex: "isKdm",
      key: "isKdm",
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

  const showLinkModal = () => {
    setLinkModalOpen(true);
  };
  //获取许诸南泽的客户公司
  const getRowSelected = (confirm, row) => {
    if (confirm) {
      console.log("confirm");
      form.setFieldValue("orgId", row[0].id);
      setLinkSelected(row[0]);
    }
    setLinkModalOpen(false);
  };
  return (
    <div>
      <PageHeader className="site-page-header" title="客户联系人" />
      <div className="search">
        <Space>
          <Input
            placeholder="请输入姓名、联系电话"
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
        destroyOnClose
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
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名!" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="联系电话"
            name="phone"
            rules={[{ required: true, message: "请输入联系电话!" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="电子邮箱" name="email" rules={[{ type: "email" }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Select
              placeholder="请选择"
              options={[
                {
                  value: 1,
                  label: "男",
                },
                {
                  value: 2,
                  label: "女",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="客户名称"
            name="orgId"
            rules={[{ required: true, message: "请选择客户!" }]}
          >
            <Select
              placeholder="请选择"
              onClick={showLinkModal}
              dropdownStyle={{
                display: "none",
              }}
              autoFocus
              options={[
                {
                  label: linkSelected.name,
                  value: linkSelected.id,
                },
              ]}
            />
          </Form.Item>

          <Form.Item label="部门" name="department">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="职位" name="jotTitle">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="关键决策人" name="isKdm">
            <Select
              placeholder="请选择"
              options={[
                {
                  value: false,
                  label: "否",
                },
                {
                  value: true,
                  label: "是",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="备注" name="description">
            <Input.TextArea placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
      {linkModalOpen && (
        <LinkCustomer
          open={linkModalOpen}
          getRowSelected={getRowSelected}
          defaultId={linkSelected.id}
        />
      )}
    </div>
  );
}
export default MsgCustomer;
