/*
 * @Author: Jonny
 * @Date: 2024-12-19 16:26:17
 * @LastEditors: Jonny
 * @LastEditTime: 2024-12-19 17:44:18
 * @FilePath: \grean-crm\src\apps\pages\contract-ops\components\setForm.jsx
 */
import React, { useState, useEffect } from "react";
import { Input, Modal, Form, message } from "antd";
import { configList, configUpdate } from "@Api/set_base.js";

function SetForm({ open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let { success, message: msg, data } = await configList();
    if (success) {
      form.setFieldsValue(data);
    } else {
      message.error(msg);
    }
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    let { success, message: msg } = await configUpdate(values);
    if (success) {
      message.success("提交成功");
      closeModal(true);
    } else {
      message.error(msg);
    }

    setLoading(false);
  };

  return (
    <div>
      <Modal
        title={"设置"}
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
          form={form}
        >
          <Form.Item label="合同提醒天数" name="CONTRACT_REMIND_DAYS">
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SetForm;
