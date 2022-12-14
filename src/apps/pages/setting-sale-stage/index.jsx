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
  InputNumber,
  PageHeader,
} from "antd";
import {
  saleStageList,
  saleStageDelete,
  saleStageUpdate,
  saleaStageAdd,
} from "@Api/set_sale.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useLocation, useParams, useNavigate } from "react-router-dom";
const { Option } = Select;

function SettingSaleStage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operateId, setOperateId] = useState(null); //正在操作id
  const [data, setData] = useState([]);
  let pipelineId = new URLSearchParams(useLocation().search).get("pipelineId");
  let navigate = useNavigate();

  useEffect(() => {
    getPageData();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getPageData = async () => {
    setLoading(true);
    let { data } = await saleStageList({ pipelineId });
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
        let { success, message: msg } = await saleStageDelete({ id });
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
    values.pipelineId = pipelineId;
    // 编辑
    if (operateId) {
      values.id = operateId;
      let { success, message: msg } = await saleStageUpdate(values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
      setOperateId(null);
    } else {
      let { success, message: msg } = await saleaStageAdd(values);
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
      title: "销售流程阶段",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "机率（%）",
      dataIndex: "dealProbability",
      key: "dealProbability",
    },
    {
      title: "阶段滞留天数",
      dataIndex: "rottenDays",
      key: "rottenDays",
    },
    {
      title: "是否预警",
      dataIndex: "isAlarm",
      key: "isAlarm",
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
  const onSwitchChange = (checked) => {};

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate(-1)}
        title="销售流程阶段设置"
      />
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
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          initialValues={{
            orgType: "1",
          }}
          form={form}
        >
          <Form.Item
            label="销售流程阶段"
            name="name"
            rules={[{ required: true, message: "请输入销售流程阶段!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="机率"
            name="dealProbability"
            rules={[{ required: true, message: "请输入!" }]}
          >
            <InputNumber placeholder="请输入" />
          </Form.Item>
          <Form.Item label="阶段滞留天数" name="rottenDays">
            <InputNumber placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="是否预警"
            name="isAlarm"
            rules={[{ required: true, message: "请输入!" }]}
          >
            <Select
              placeholder="请选择"
              options={[
                {
                  label: "是",
                  value: true,
                },
                {
                  label: "否",
                  value: false,
                },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item label="排序" name="orderNr">
            <InputNumber
              min={1}
              max={10000}
              formatter={(value) => Math.floor(value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SettingSaleStage;
