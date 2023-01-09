import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Modal,
  Form,
  message,
  InputNumber,
  Tooltip,
  PageHeader,
  Statistic,
} from "antd";
import {
  productList,
  productDelete,
  productUpdate,
  productAdd,
  productTypeList,
} from "@Api/product.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

function ProductManage() {
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
  const [typelist, setTypelist] = useState([]);

  useEffect(() => {
    getProducttTypelist();
  }, []);
  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const getProducttTypelist = async () => {
    let { data } = await productTypeList();

    await setTypelist(data);

    getPageData();
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
    productList({
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
        let { success, message: msg } = await productDelete({ id });
        if (success) {
          message.success("删除成功");
          setIsModalOpen(false);
          search();
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
    setOperateId(null);
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
      let { success, message: msg } = await productUpdate(values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
      setOperateId(null);
    } else {
      let { success, message: msg } = await productAdd(values);
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
      title: "产品名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "产品编码",
      dataIndex: "code",
      key: "code",
    },

    {
      title: "产品类型",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (value) => {
        let res = typelist.filter((ele) => ele.id == value);
        return res[0]?.name ?? "--";
      },
    },

    {
      title: "单价(元)",
      dataIndex: "price",
      key: "price",
      render: (value) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },

    {
      title: "单位",
      dataIndex: "unit",
      key: "unit",
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
  return (
    <div>
      <PageHeader className="site-page-header" title="产品管理" />
      <div className="search">
        <Space>
          <Input
            placeholder="请输入产品名称、产品编码"
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
            label="产品名称"
            name="name"
            rules={[{ required: true, message: "请输入产品名称!" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="产品编码"
            name="code"
            rules={[{ required: true, message: "请输入产品编码!" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="产品类型" name="categoryId">
            <Select
              placeholder="请选择"
              options={(typelist || []).map((d) => ({
                value: d.id,
                label: d.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="单价" name="price">
            <InputNumber placeholder="请输入" min={0} />
          </Form.Item>
          <Form.Item label="单位" name="unit">
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

export default ProductManage;
