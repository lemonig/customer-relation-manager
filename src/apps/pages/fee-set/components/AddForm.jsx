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
  PageHeader,
  Statistic,
} from "antd";

let yearList = [];
for (let i = 2018; i < new Date().getFullYear() + 3; i++) {
  yearList.unshift({
    label: `${i}年`,
    value: i,
  });
}

function AddForm({ isModalOpen, closeModal }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) => index + 1,
    },
    {
      title: "费用报销单号",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "报销类型",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "合同名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "客户公司",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "费用类型",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "开始时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "结束时间",
      dataIndex: "updateTime",
      key: "updateTime",
    },
    {
      title: "合同额",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "updateTime",
      key: "updateTime",
    },
  ];

  return (
    <Modal
      title="报销费用明细"
      open={isModalOpen}
      onOk={() => closeModal()}
      onCancel={() => closeModal()}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="确认结果"
          name="approveStatus"
          rules={[{ required: true, message: "请选择!" }]}
        >
          <Select
            placeholder="请输入"
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
        <Form.Item label="备注" name="description">
          <Input.TextArea placeholder="请输入" />
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id}
      />
    </Modal>
  );
}

export default AddForm;
