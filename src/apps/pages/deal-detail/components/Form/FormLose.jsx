import React, { useState, useEffect } from "react";

import { Select, Modal, Form, message, Input } from "antd";
import { dealterminate, deallose, dealwin, dealtransfer } from "@Api/deal_list";
import { loseList, loseDelete, loseUpdate, loseAdd } from "@Api/set_lose.js";

function FormLose({ open, closeModal, pipelineId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      let { data } = await loseList();
      setUser(data);
    };
    getUser();
  }, []);

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    values.id = pipelineId;
    setLoading(true);
    let { success, message: msg } = await deallose(values);
    if (success) {
      message.success("提交成功");
      closeModal(true, "lose");
    } else {
      message.error(msg);
    }
    setLoading(false);
  };

  return (
    <Modal
      title="丢单原因"
      open={open}
      onOk={handleOk}
      onCancel={() => closeModal(false)}
      maskClosable={false}
      destroyOnClose
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
          label="丢单原因 "
          name="lostReasonId"
          rules={[{ required: true, message: "请选择!" }]}
        >
          <Select
            placeholder="请选择"
            options={user}
            fieldNames={{
              label: "name",
              value: "id",
            }}
          ></Select>
        </Form.Item>
        <Form.Item label="丢单原因" name="description">
          <Input.TextArea placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default FormLose;
