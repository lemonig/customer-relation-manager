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
  AutoComplete,
} from "antd";
import {
  companyInfo,
  companyDelete,
  companyUpdate,
  companyAdd,
} from "@Api/info_company.js";
import { tianyancha } from "@Api/public.js";
import { organize } from "@Utils/data";
import { province } from "@Utils/provice.js";

const proviceSelect = province.map((item) => ({
  label: item,
  value: item,
}));

function FormComy({ record, open, closeModal }) {
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
      let { success, message: msg } = await companyUpdate(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await companyAdd(values);
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
  const handleChange = (_, option) => {};
  return (
    <>
      <Modal
        title={record ? "编辑" : "新建"}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="客户名称"
            name="name"
            rules={[{ required: true, message: "请输入客户名称!" }]}
          >
            <AutoComplete
              placeholder="请输入"
              defaultActiveFirstOption={true}
              filterOption={false}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
              options={tycList}
            />
          </Form.Item>
          <Form.Item label="机构类型" name="orgType">
            <Select
              placeholder="请选择机构"
              options={[
                {
                  label: "政府机构",
                  value: 1,
                },
                {
                  label: "企业单位",
                  value: 2,
                },
                {
                  label: "个人",
                  value: 3,
                },
                {
                  label: "其他",
                  value: 4,
                },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item label="省份" name="base">
            <Select placeholder="请选择机构" options={proviceSelect}></Select>
          </Form.Item>
          <Form.Item label="统一社会信用代码" name="creditCode">
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
    </>
  );
}

export default FormComy;
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
      let res = data.map((item) => ({
        value: item.name,
      }));
      callback(res);
    }
  };
  timeout = setTimeout(fake, 300);
};
