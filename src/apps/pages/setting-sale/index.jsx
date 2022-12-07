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
  Switch,
  PageHeader,
} from "antd";
import { saleList, saleDelete, saleUpdate, saleAdd } from "@Api/set_sale.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

function SettingSale() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operateId, setOperateId] = useState(null); //正在操作id
  const [data, setData] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    getPageData();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getPageData = async () => {
    setLoading(true);
    let { data } = await saleList();
    setData(data);
    setLoading(false);
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
        let { success, message: msg } = await saleDelete({ id });
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
      let { success, message: msg } = await saleUpdate(values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
        getPageData();
      } else {
        message.error(msg);
      }
      setOperateId(null);
    } else {
      let { success, message: msg } = await saleAdd(values);
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
      render: (_, record, index) => index + 1,
    },
    {
      title: "销售流程",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "销售阶段",
      dataIndex: "stageCount",
      key: "stageCount",
      width: 100,
      render: (value, record) => (
        <Space>
          <a>{value}</a>
        </Space>
      ),
      onCell: (record) => ({
        onClick: (event) => {
          gotoSaleStage(record.id);
        },
      }),
    },
    {
      title: "预测权重",
      // dataIndex: "dealProbability",
      key: "dealProbability",
      render: (_, record) => (
        <Switch
          checked={record.dealProbability}
          onChange={(checked) => onSwitchChange(checked, record)}
          size="small"
        />
      ),
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
  // 预测权重开关
  const onSwitchChange = async (checked, record) => {
    let params = {
      id: record.id,
      dealProbability: checked,
    };
    let { success, message: msg } = await saleUpdate(params);
    if (success) {
      message.success("操作成功");
      // record.dealProbability = !record.dealProbability;
      getPageData();
    } else {
      message.error("操作失败");
    }
  };
  const gotoSaleStage = (id) => {
    navigate({
      pathname: "/settingSaleStage",
      search: `?pipelineId=${id}`,
    });
  };

  return (
    <div>
      <PageHeader className="site-page-header" title="销售流程" />
      <div className="search">
        <Space>
          <Button onClick={handleAdd}>新建</Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id}
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
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          initialValues={{
            orgType: "1",
          }}
          form={form}
        >
          <Form.Item
            label="销售流程"
            name="name"
            rules={[{ required: true, message: "请输入销售流程!" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SettingSale;
