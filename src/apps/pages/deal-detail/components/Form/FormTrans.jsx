import React, { useState, useEffect } from "react";

import { Select, Modal, Form, message } from "antd";
import { dealterminate, deallose, dealwin, dealtransfer } from "@Api/deal_list";
import { userList } from "@Api/set_user.js";

function FormTrans({ open, closeModal, pipelineId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      let { data } = await userList();
      setUser(data);
    };
    getUser();
  }, []);

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    values.id = pipelineId;
    setLoading(true);
    let { success, message: msg } = await dealtransfer(values);
    if (success) {
      message.success("提交成功");
      closeModal(true);
    } else {
      message.error(msg);
    }
    setLoading(false);
  };

  return (
    <Modal
      title="转机商机所属人"
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
          label="姓名 "
          name="ownerUserId"
          rules={[{ required: true, message: "请选择!" }]}
        >
          <Select
            placeholder="请选择"
            options={user}
            fieldNames={{
              label: "nickname",
              value: "id",
            }}
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default FormTrans;
