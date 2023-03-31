import React, { useState, useEffect } from "react";

import { Select, Modal, Form, message } from "antd";
import { dealterminate, deallose, dealwin, dealtransfer } from "@Api/deal_list";
import { salesmanByYear } from "@Api/set_user.js";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

function FormTrans({ open, closeModal, pipelineId }) {
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      let { data } = await salesmanByYear();
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
      closeModal(true, "trans");
      navigate({
        pathname: "/dealList",
        replace: true,
      });
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
              label: "name",
              value: "id",
            }}
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default FormTrans;
