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
  PageHeader,
  Statistic,
  InputNumber,
} from "antd";
import { salesmanByYear } from "@Api/set_user";
import { configAdd, configUpdate } from "@Api/fee-set";

let yearList = [];
for (let i = 2018; i < new Date().getFullYear() + 3; i++) {
  yearList.unshift({
    label: `${i}年`,
    value: i,
  });
}

function AddForm({ isModalOpen, closeModal, operate }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    console.log(operate);
    if (operate) form.setFieldsValue(operate);
    getSalesmanList();
  }, []);

  //销售人员
  const getSalesmanList = async () => {
    let year = form.getFieldValue("year");
    console.log(year);
    let { data } = await salesmanByYear({ year });

    setData(data);
  };
  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) => index + 1,
    },
    {
      title: "人员",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "部门",
      dataIndex: "deptName",
      key: "deptName",
    },
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 新建
  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    if (operate) {
      let { success, message: msg } = await configUpdate(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      values.userIdList = selectedRowKeys;
      let { success, message: msg } = await configAdd(values);
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
    <Modal
      title="报销额度"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => closeModal()}
      maskClosable={false}
      destroyOnClose
      width={800}
    >
      <div className="search">
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          form={form}
          layout="inline"
        >
          <Form.Item label="" name="year">
            <Select
              placeholder="请输入"
              options={yearList}
              style={{ width: 120 }}
              onChange={getSalesmanList}
            />
          </Form.Item>
          <Form.Item label="" name="contractValue">
            <InputNumber
              placeholder="请输入合同报销额度"
              style={{ width: 200 }}
              min={0}
              max={100}
              // formatter={(value) => `${value}%`}
              // parser={(value) => value.replace("%", "")}
              addonAfter="%"
            />
          </Form.Item>
          <Form.Item label="" name="dealValue">
            <InputNumber
              placeholder="请输入商机报销额度"
              style={{ width: 200 }}
              min={0}
              max={100}
              // formatter={(value) => `${value}%`}
              // parser={(value) => value.replace("%", "")}
              addonAfter="%"
            />
          </Form.Item>
        </Form>
      </div>
      {operate ? null : (
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.id}
          rowSelection={rowSelection}
        />
      )}
    </Modal>
  );
}

export default AddForm;
