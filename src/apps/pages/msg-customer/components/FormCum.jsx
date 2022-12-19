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
  customerInfo,
  customerDelete,
  customerUpdate,
  customerAdd,
} from "@Api/info_customer.js";
import LinkBusiness from "@Shared/LinkBusiness";
import LinkCustomer from "@Shared/LinkCustomer";
import { activeList } from "@Api/set_active.js";
import moment from "moment";

function FormCum({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkSelected, setLinkSelected] = useState({});
  const [loading, setLoading] = useState(false);

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
      let { success, message: msg } = await customerUpdate(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await customerAdd(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    }

    setLoading(false);
  };

  const showLinkModal = () => {
    setLinkModalOpen(true);
  };
  //获取许诸南泽的客户公司
  const getRowSelected = (confirm, row) => {
    if (confirm) {
      form.setFieldValue("orgId", row[0].id);
      setLinkSelected(row[0]);
    }
    setLinkModalOpen(false);
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
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名!" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="联系电话"
            name="phone"
            rules={[{ required: true, message: "请输入联系电话!" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="电子邮箱" name="email" rules={[{ type: "email" }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Select
              placeholder="请选择"
              options={[
                {
                  value: 1,
                  label: "男",
                },
                {
                  value: 2,
                  label: "女",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="客户名称"
            name="orgId"
            rules={[{ required: true, message: "请选择客户!" }]}
          >
            <Select
              placeholder="请选择"
              onClick={showLinkModal}
              dropdownStyle={{
                display: "none",
              }}
              autoFocus
              options={[
                {
                  label: linkSelected.name,
                  value: linkSelected.id,
                },
              ]}
            />
          </Form.Item>

          <Form.Item label="部门" name="department">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="职位" name="jobTitle">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="关键决策人" name="isKdm">
            <Select
              placeholder="请选择"
              options={[
                {
                  value: false,
                  label: "否",
                },
                {
                  value: true,
                  label: "是",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="备注" name="description">
            <Input.TextArea placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
      {linkModalOpen && (
        <LinkCustomer
          open={linkModalOpen}
          getRowSelected={getRowSelected}
          defaultId={linkSelected.id}
        />
      )}
    </div>
  );
}

export default FormCum;
