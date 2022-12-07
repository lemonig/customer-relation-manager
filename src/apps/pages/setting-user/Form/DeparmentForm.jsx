import React, { useState, useEffect } from "react";
import { Modal, message, Form, Input, Select, InputNumber } from "antd";
import { deptDelete, deptAdd, deptList, deptUpdate } from "@Api/set_dept.js";
import CrmUser from "./CrmUser";

function DeparmentForm({ isModalOpen, closeModal, data, operate, deptData }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); //员工
  // const [deptData, setDeptData] = useState([]); //部门
  const [linkModalOpen, setLinkModalOpen] = useState(false); //部门负责人
  const [linkSelected, setLinkSelected] = useState({}); //部门负责人
  console.log(data);
  useEffect(() => {
    if (operate === "add") {
      form.setFieldValue("pId", data.id);
    } else if (operate === "edit") {
      form.setFieldsValue(data);
      form.setFieldValue("pId", data.pid);
      setLinkSelected({
        id: data.leaderId,
        nickname: data.leaderName,
      });
    }
  }, [JSON.stringify(data)]);
  // 获取部门

  // 新建部门
  const handleOk = async () => {
    setLoading(true);
    await form.validateFields();
    const values = form.getFieldsValue();
    console.log(values);
    setLoading(true);
    if (operate === "edit") {
      // 编辑部门
      values.id = data.id;
      let { success, message: msg } = await deptUpdate(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      // 新建员工
      let { success, message: msg } = await deptAdd(values);
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
  //获取部门负责人选中
  const getRowSelected = (confirm, row) => {
    if (confirm) {
      console.log(row);
      form.setFieldValue("leaderId", row[0].id);
      setLinkSelected(row[0]);
    }
    setLinkModalOpen(false);
  };

  return (
    <div>
      <Modal
        title={` ${operate === "edit" ? "编辑" : "新建"}部门`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          name="basic"
          autoComplete="off"
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item label="部门名称" name="name">
            <Input placeholder="请输入" />
          </Form.Item>
          {/* 顶级新建有， 编辑无 */}
          {data.level == 0 && operate === "edit" ? null : (
            <Form.Item label="上级部门" name="pId">
              <Select
                options={deptData}
                fieldNames={{
                  label: "name",
                  value: "id",
                }}
              />
            </Form.Item>
          )}

          <Form.Item label="部门负责人" name="leaderId">
            <Select
              placeholder="请选择"
              onClick={showLinkModal}
              dropdownStyle={{
                display: "none",
              }}
              autoFocus
              options={[
                {
                  label: linkSelected.nickname,
                  value: linkSelected.id,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="部门编码" name="code">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="排序" name="orderNr">
            <InputNumber
              min={1}
              max={10000}
              formatter={(value) => Math.floor(value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* 部门负责人 */}
      {linkModalOpen ? (
        <CrmUser
          open={linkModalOpen}
          getRowSelected={getRowSelected}
          defaultId={linkSelected.id}
          title="部门负责人"
        />
      ) : null}
    </div>
  );
}

export default DeparmentForm;
