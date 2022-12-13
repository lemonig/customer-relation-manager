import React, { useState, useEffect } from "react";
import { Input, Modal, Form, message } from "antd";
import { cooperateUpdate, cooperateAdd } from "@Api/info_cooperate.js";

function FormCoop({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!!record) {
      form.setFieldsValue(record);
    }
  }, []);

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // values.orgId = linkSelected.id;
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await cooperateUpdate(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await cooperateAdd(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <Modal
        title={record ? "编辑" : "新建"}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        destroyOnClose
        confirmLoading={loading}
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
            <Input placeholder="请输入" />
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

export default FormCoop;
