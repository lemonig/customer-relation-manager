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
  Tooltip,
  PageHeader,
  DatePicker,
  Checkbox,
} from "antd";
import {
  agentInfo,
  agentDelete,
  agentUpdate,
  agentAdd,
} from "@Api/info_agent.js";
import { tianyancha } from "@Api/public.js";
import { organize } from "@Utils/data";

function FormAgent({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkSelected, setLinkSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [tycList, setTycList] = useState([]);
  const [tycCompany, setTycCompany] = useState([]);

  useEffect(() => {
    if (!!record) {
      setLinkSelected({
        id: record.orgId,
        name: record.orgName,
      });
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
      let { success, message: msg } = await agentUpdate(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await agentAdd(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    }

    setLoading(false);
  };

  // 工商信息搜索
  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue, setTycList);
    } else {
      setTycList([]);
    }
  };
  const handleChange = (_, option) => {
    form.setFieldsValue({
      ...option,
      orgType: option.companyType,
    });
  };
  return (
    <>
      <Modal
        title={record ? "编辑" : "新建"}
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
            <Select
              showSearch
              placeholder="请输入"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
              fieldNames={{
                label: "name",
                value: "creditCode",
              }}
              options={tycList}
            />
          </Form.Item>
          <Form.Item label="机构类型" name="orgType">
            <Select
              placeholder="请选择机构"
              options={organize}
              disabled
            ></Select>
          </Form.Item>
          <Form.Item label="统一社会信用代码" name="creditCode">
            <Input disabled placeholder="请输入" />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="备注" name="description">
            <Input.TextArea placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default FormAgent;
let timeout;
let currentValue;

const fetch = (value, callback) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  const fake = async () => {
    let { data } = await tianyancha({
      keyword: value,
    });
    if (currentValue === value) {
      callback(data);
    }
  };
  timeout = setTimeout(fake, 300);
};
