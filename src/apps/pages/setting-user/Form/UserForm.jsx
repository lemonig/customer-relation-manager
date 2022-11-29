import React, { useState, useEffect } from "react";
import {
  Tree,
  Space,
  Table,
  Tag,
  Layout,
  Modal,
  message,
  Button,
  PageHeader,
  Dropdown,
  Menu,
  Form,
  Col,
  Input,
  Row,
  Select,
  TreeSelect,
} from "antd";
import {
  userList,
  userUpdate,
  userDelete,
  userAdd,
  userSearch,
  rolelist,
} from "@Api/set_user.js";
import CrmUser from "./CrmUser";

function UserForm({ isModalOpen, closeModal, treeData, userData }) {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [linkModalOpen, setLinkModalOpen] = useState(false); //直接上级
  const [linkSelected, setLinkSelected] = useState({}); //直接上级

  const [form] = Form.useForm(); //员工
  // if (userData) {
  //   form.setFieldsValue({
  //     ...userData,
  //     name: userData.nickname,
  //   });
  //   setLinkSelected({
  //     id: userData.leaderId,
  //     name: userData.leaderName,
  //   });
  // }

  useEffect(() => {
    getRoleList();
  }, []);

  const getRoleList = async () => {
    let { data } = await rolelist();
    setRoleList(data);
    console.log(userData);
    if (userData) {
      form.setFieldsValue({
        ...userData,
        name: userData.nickname,
      });
      setLinkSelected({
        id: userData.leaderId,
        nickname: userData.leaderName,
      });
    }
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    if (userData.id) {
      // 编辑员工
      values.id = userData.id;
      let { success, message: msg } = await userUpdate(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      // 新建员工

      let { success, message: msg } = await userAdd(values);
      if (success) {
        message.success("提交成功");
        closeModal(true);
      } else {
        message.error(msg);
      }
    }
    setLoading(false);
  };

  // 员工信息搜索
  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue, setStaffList);
    } else {
      setStaffList([]);
    }
  };
  const handleChange = (_, option) => {
    form.setFieldsValue({
      ...option,
      nickname: option.name,
      openId: option.openId,
      deptId: "",
    });
  };

  const modalClosed = () => {
    form.setFieldsValue({});
  };

  const showLinkModal = () => {
    setLinkModalOpen(true);
  };
  //获取直接上级选中
  const getRowSelected = (confirm, row) => {
    if (confirm) {
      form.setFieldValue("leaderId", row[0].id);
      setLinkSelected(row[0]);
    }
    setLinkModalOpen(false);
  };

  return (
    <>
      <Modal
        title={` ${userData?.id ? "编辑" : "新建"}员工`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        width="600px"
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          name="basic"
          autoComplete="off"
          initialValues={{
            orgType: "1",
          }}
          layout="vertical"
          form={form}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="姓名"
                name="nickname"
                rules={[{ required: true, message: "请输入姓名!" }]}
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
                    value: "name",
                  }}
                  options={staffList}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[{ required: true, message: "请输入手机号!" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="openId" name="openId">
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="username" name="username">
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item
                label="登录密码"
                name="password"
                rules={[{ required: true, message: "请输入登录密码!" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col> */}
            {/* <Col span={12}>
              <Form.Item label="性别" name="password">
                <Select
                  options={[
                    {
                      value: "1",
                      label: "男",
                    },
                    {
                      value: "2",
                      label: "女",
                    },
                  ]}
                />
              </Form.Item>
            </Col> */}
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="邮箱" name="email">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="部门"
                name="deptId"
                rules={[{ required: true, message: "部门不能为空!" }]}
              >
                <TreeSelect
                  showSearch
                  dropdownStyle={{
                    maxHeight: 400,
                    overflow: "auto",
                  }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  treeData={treeData}
                  fieldNames={{ label: "name", value: "id" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            {/* <Col span={12}>
              <Form.Item label="岗位" name="name">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item label="直接上级" name="leaderId">
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
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="角色"
                name="roleList"
                rules={[{ required: true, message: "请输入姓名!" }]}
              >
                <Select
                  options={roleList}
                  mode="multiple"
                  showArrow
                  fieldNames={{ label: "name", value: "id" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* 直接上级 */}
      <CrmUser
        open={linkModalOpen}
        getRowSelected={getRowSelected}
        defaultId={linkSelected.id}
      />
    </>
  );
}

export default UserForm;

let timeout;
let currentValue;

const fetch = (value, callback) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  const fake = async () => {
    let { data } = await userSearch({
      name: value,
    });
    if (currentValue === value) {
      callback(data);
    }
  };
  timeout = setTimeout(fake, 300);
};
