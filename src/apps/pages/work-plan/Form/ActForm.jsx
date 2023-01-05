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
import { actPage, actDelete, actUpdate, actAdd } from "@Api/act_adm.js";
import LinkBusiness from "@Shared/LinkBusiness";
// import LinkCustomer from "@Shared/LinkCustomer";
import { activeList } from "@Api/set_active.js";
import { customerInfo } from "@Api/info_customer.js";
import moment from "moment";
import MyTimePicker from "@Components/MyTimePicker";
const { Option } = Select;

function ActForm({ isModalOpen, record, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false); //商机
  const [linkSelected, setLinkSelected] = useState({}); //商机
  // const [linkModalOpenC, setLinkModalOpenC] = useState(false); //联系人客户
  const [linkSelected1, setLinkSelected1] = useState({}); //联系人客户
  const [actData, setActData] = useState([]); //活动类型
  const [customLink, setCustomerLink] = useState([]); //客户联系人

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    await getActiveList();
    await getCustomerLink();
    if (record) {
      //编辑
      record.endTimeDto.date = moment(record.endTimeDto.date);
      record.startTimeDto.date = moment(record.startTimeDto.date);

      setLinkSelected({
        id: record.deal.id,
        title: record.deal.name,
      });
      setLinkSelected1({
        id: record.orgId,
        name: record.orgName,
      });
      form.setFieldsValue(record);
      form.setFieldValue("dealId", record.deal.id);
    } else {
      //新建
      setLinkSelected({});
      setLinkSelected1({});
    }
  };

  //获取活动类型
  const getActiveList = async () => {
    let { data } = await activeList();
    setActData(data);
  };

  const getCustomerLink = async () => {
    let { data } = await customerInfo();

    setCustomerLink(data);
  };

  //获取回调商机
  const getRowSelected = (confirm, row) => {
    if (confirm && row) {
      setLinkSelected(row[0]);
      form.setFieldValue("dealId", row[0].id);
    }
    setLinkModalOpen(false);
  };
  //获取许诸南泽的客户公司
  const getRowSelected1 = (confirm, row) => {
    if (confirm) {
      form.setFieldValue("orgId", row[0].id);
      setLinkSelected1(row[0]);
    }
    // setLinkModalOpenC(false);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    values.startTime = moment(values.startTimeDto.date).format("YYYYMMDD");
    values.endTime = moment(values.endTimeDto.date).format("YYYYMMDD");
    values.endTimeDto.date = moment(values.endTimeDto.date).format("YYYYMMDD");
    values.startTimeDto.date = moment(values.startTimeDto.date).format(
      "YYYYMMDD"
    );
    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await actUpdate(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await actAdd(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    }
    // 添加
    setLoading(false);
  };
  // 选择人
  const handleSelectPeople = (val) => {
    let res = customLink.find((ele) => ele.id === val);
    if (res) {
      form.setFieldValue("phone", res.phone);
    }
  };
  return (
    <>
      <Modal
        title={record ? "编辑" : "新建"}
        open={isModalOpen}
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
          initialValues={
            {
              // startTimeDto: {
              //   date: "2021-12-08",
              //   time: "0030",
              // },
            }
          }
          form={form}
        >
          <Form.Item
            label="任务类型"
            name="typeId"
            rules={[{ required: true, message: "请选择任务类型!" }]}
          >
            <Select
              fieldNames={{
                label: "name",
                value: "id",
              }}
              options={actData}
              placeholder="请选择"
            />
          </Form.Item>

          <Form.Item
            label="任务开始时间"
            name="startTimeDto"
            rules={[{ required: true, message: "请选择开始时间!" }]}
          >
            <MyTimePicker />
          </Form.Item>
          <Form.Item
            label="任务结束时间"
            name="endTimeDto"
            rules={[{ required: true, message: "请选择结束时间!" }]}
          >
            <MyTimePicker />
          </Form.Item>
          <Form.Item
            label="商机名称"
            name="dealId"
            rules={[{ required: true, message: "请选择商机!" }]}
          >
            <Select
              placeholder="请选择"
              onClick={() => {
                setLinkModalOpen(true);
              }}
              dropdownStyle={{
                display: "none",
              }}
              autoFocus
              options={[
                {
                  label: linkSelected.title,
                  value: linkSelected.id,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="客户联系人" name="personId">
            <Select
              fieldNames={{
                label: "name",
                value: "id",
              }}
              options={customLink}
              placeholder="请选择"
            />
          </Form.Item>
          <Form.Item label="地点" name="address">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="其他参与人员" name="participant">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="任务描述" name="description">
            <Input.TextArea placeholder="请输入" />
          </Form.Item>

          {/* <Form.Item label="客户名称" name="orgId">
            <Select
              placeholder="请选择"
              onClick={() => setLinkModalOpenC(true)}
              dropdownStyle={{
                display: "none",
              }}
              autoFocus
              options={[
                {
                  label: linkSelected1.name,
                  value: linkSelected1.id,
                },
              ]}
            />
          </Form.Item> */}

          <Form.Item
            name="done"
            valuePropName="checked"
            wrapperCol={{ offset: 6, span: 16 }}
          >
            <Checkbox>标记为已完成</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
      {/* 商机 */}
      {linkModalOpen && (
        <LinkBusiness
          open={linkModalOpen}
          getRowSelected={getRowSelected}
          defaultId={linkSelected.id}
        />
      )}

      {/* 客户联系人 */}
      {/* {linkModalOpenC && (
        <LinkCustomer
          open={linkModalOpenC}
          getRowSelected={getRowSelected1}
          defaultId={linkSelected.id}
        />
      )} */}
    </>
  );
}

export default ActForm;
