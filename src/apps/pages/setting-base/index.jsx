/*
 * @Author: Jonny
 * @Date: 2024-10-16 14:59:50
 * @LastEditors: Jonny
 * @LastEditTime: 2024-10-16 15:44:52
 * @FilePath: \grean-crm\src\apps\pages\setting-base\index.jsx
 */
import React, { useState, useEffect } from "react";
import {
  InputNumber,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  PageHeader,
} from "antd";
import { configList, configUpdate } from "@Api/set_base.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

function SettingBase() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operateId, setOperateId] = useState(null); //正在操作id
  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getPageData = async () => {
    setLoading(true);
    let { data } = await configList();
    form.setFieldsValue({
      ACTIVITY_LIMIT_DAYS: Number(data.ACTIVITY_LIMIT_DAYS),
    });
    setLoading(false);
  };

  const onFinish = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑
    let { success, message: msg } = await configUpdate(values);
    if (success) {
      message.success("提交成功");
    } else {
      message.error(msg);
    }

    // 添加
    getPageData();
    setLoading(false);
  };

  return (
    <div>
      <PageHeader className="site-page-header" title="基本设置" />
      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        colon={false}
      >
        <Form.Item label="任务回补时限">
          <Form.Item name="ACTIVITY_LIMIT_DAYS" noStyle>
            <InputNumber placeholder="请输入" min="1" max="9999" />
          </Form.Item>
          <span style={{ marginLeft: "8px" }}>
            创建任务时开始时间距离现在时间不能超过回补天数
          </span>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SettingBase;
