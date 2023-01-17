import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Space,
  Table,
  PageHeader,
  DatePicker,
  Col,
  Row,
  Form,
  Select,
  Checkbox,
  Tooltip,
  Statistic,
  TreeSelect,
} from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { salesmanList } from "@Api/set_user";
import { deptList as deptListApi } from "@Api/set_dept.js";
import { configList } from "@Api/fee-set";
import { arrayToTree } from "@Utils/util";

let yearList = [];
for (let i = 2018; i < moment().year() + 3; i++) {
  yearList.unshift({
    label: `${i}年`,
    value: i,
  });
}

function FeeSet() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchVal, setSearchVal] = useState("");
  const [selectVal, setSelectVal] = useState("1");
  const [data, setData] = useState([]);
  const [searchForm] = Form.useForm();
  const [salerList, setSalerList] = useState([]);
  const [deptList, setDeptList] = useState([]);

  useEffect(() => {
    getPageData();
    JSON.stringify(pageMsg);
  }, [JSON.stringify(pageMsg)]);

  useEffect(() => {
    getSalesmanList();
    getDeptList();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };
  //部门
  const getDeptList = async () => {
    let { data } = await deptListApi();

    let res = arrayToTree(data);

    setDeptList(res);
  };

  // 查询
  const search = () => {
    // FIXME 第一页会不触发hooks,故分开
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
    configList({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        name: searchVal,
        orgType: selectVal,
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

  // 新建
  const handleAdd = () => {
    setOperate(null);
    setIsModalOpen(true);
  };
  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    setIsModalOpen(true);
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
      title: "部门",
      dataIndex: "deptName",
      key: "deptName",
    },
    {
      title: "人员",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },
    {
      title: "年份",
      dataIndex: "year",
      key: "year",
    },

    {
      title: "合同报销额度（%）",
      dataIndex: "contractValue",
      key: "contractValue",
    },
    {
      title: "商机报销额度（%）",
      dataIndex: "dealValue",
      key: "dealValue",
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
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
        </Space>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchVal(value);
  };
  const handleSelectChange = (value) => {
    setSelectVal(value);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
  };

  return (
    <div>
      <PageHeader className="site-page-header" title="费用设置" />
      <div className="search" style={{ marginBottom: "0px" }}>
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="deptIdList">
            <TreeSelect
              showSearch
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="部门"
              allowClear
              treeDefaultExpandAll
              treeData={deptList}
            />
          </Form.Item>
          <Form.Item label="" name="userIdList">
            <Select
              style={{ width: 120 }}
              options={salerList}
              placeholder="销售人员"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
            />
          </Form.Item>
          <Form.Item label="" name="year">
            <Select
              style={{ width: 120 }}
              options={yearList}
              placeholder="年份"
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleAdd}>新建</Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default FeeSet;
