import React, { useState, useEffect } from "react";
import { Input, Select, Modal, Form, message } from "antd";

import { approveOperate } from "@Api/deal_list";

function FormConfirm({ open, closeModal, operate }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    values.idList = operate;
    setLoading(true);

    let { success, message: msg } = await approveOperate(values);
    if (success) {
      message.success("提交成功");
      closeModal(true);
    } else {
      message.error(msg);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal
        title="批量确认"
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        confirmLoading={loading}
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
      </Modal>
    </>
  );
}

export default FormConfirm;
