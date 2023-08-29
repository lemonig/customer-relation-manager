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
  Cascader,
  PageHeader,
} from "antd";
import {
  expertInfo,
  expertDelete,
  expertUpdate,
  expertAdd,
} from "@Api/info_expert.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import proviceJson from "@Utils/provice.json";

const proviceOptions = () => {
  let res = [];
  for (let i in proviceJson) {
    let obj = {
      label: i,
      value: i,
      children: proviceJson[i].map((j) => ({
        label: j,
        value: j,
      })),
    };
    res.push(obj);
  }
  return res;
};

function MsgExpert() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operateId, setOperateId] = useState(null); //正在操作id
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchVal, setSearchVal] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // 查询
  const search = () => {
    if (pageMsg.pagination.current === 1) {
      getPageData();
    } else {
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          current: 1,
        },
      });
    }
  };
  const getPageData = () => {
    setLoading(true);
    expertInfo({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        name: searchVal,
      },
    }).then((res) => {
      setData(res.data);
      setLoading(false);
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          total: res.additional_data.pagination.total,
        },
      });
    });
  };

  // 删除
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法回复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await expertDelete({ id });
        if (success) {
          message.success("删除成功");
          setIsModalOpen(false);
          search();
        } else {
          message.error("删除失败");
        }
      },
    });
  };
  // 新建
  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  // 编辑
  const handleEdit = (record) => {
    setOperateId(record.id);
    record.area = [record.provinceName, record.cityName];
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    if (values.area) {
      values.provinceName = values.area[0];
      values.cityName = values.area[1];
    }
    // 编辑
    if (operateId) {
      values.id = operateId;
      let { success, message: msg } = await expertUpdate(values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
      setOperateId(null);
    } else {
      let { success, message: msg } = await expertAdd(values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
    }
    // 添加
    getPageData();
    setLoading(false);
  };

  // 弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
    },

    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "省份",
      dataIndex: "provinceName",
      key: "provinceName",
    },
    {
      title: "城市",
      dataIndex: "cityName",
      key: "cityName",
    },
    {
      title: "公司名称",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "职位",
      dataIndex: "jobTitle",
      key: "jobTitle",
    },

    {
      title: "创建用户",
      dataIndex: "createUserName",
      key: "createUserName",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
    },
    {
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDel(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchVal(value);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };
  return (
    <div>
      <PageHeader className="site-page-header" title="专家库" />
      <div className="search">
        <Space>
          <Input
            placeholder="请输入姓名、联系电话"
            style={{ width: 240 }}
            // value={searchVal}
            onChange={handleInputChange}
          />

          <Button type="primary" onClick={search}>
            查询
          </Button>
          <Button onClick={handleAdd}>新建</Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
      {/* 弹出表单 */}
      <Modal
        title={operateId ? "编辑" : "新建"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
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
            rules={[{ required: true, message: "请输入!" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="联系电话" name="phone">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="省市" name="area">
            <Cascader options={proviceOptions()} placeholder="请选择" />
          </Form.Item>

          {/* <Form.Item label="机构类型" name="orgType">
            <Select placeholder="请选择机构">
              <Option value="1">政府</Option>
              <Option value="2">企业</Option>
            </Select>
          </Form.Item> */}

          <Form.Item label="公司名称" name="company">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="职位" name="jobTitle">
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MsgExpert;
