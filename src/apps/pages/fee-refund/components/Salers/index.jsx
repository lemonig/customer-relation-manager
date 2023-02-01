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
import { feePersonList, feeListPersonExport } from "@Api/fee-refund";
import { dictList } from "@Api/public";
import { deptList as deptListApi } from "@Api/set_dept.js";
import { arrayToTree } from "@Utils/util";
import { salesmanList } from "@Api/set_user";
import TablePopup from "./components/TablePopup";

const { RangePicker } = DatePicker;
let yearList = [];
for (let i = 2018; i < moment().year() + 3; i++) {
  yearList.unshift({
    label: `${i}年`,
    value: i,
  });
}

function Salers() {
  let navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [dictData, setDictData] = useState({
    feeType: [], // 费用类型
    fromType: [], //数据来源
    expenseType: [], //报销类型
  });
  const [expenseType, setExpenseType] = useState([]);
  const [fromType, setFromType] = useState([]);
  const [feeType, setFeeType] = useState([]);
  const [deptList, setDeptList] = useState([]);

  const [operate, setOperate] = useState(null); //正在操作
  const [salerList, setSalerList] = useState([]);

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

  const getDictData = async () => {
    let { data } = await dictList({
      dictType: "fee_type",
    });
    setDictData({
      ...dictData,
      feeType: data,
    });
    setFeeType(data);
  };
  const getDictData1 = async () => {
    let { data } = await dictList({
      dictType: "from_type",
    });
    setFromType(data);
    setDictData({
      ...dictData,
      fromType: data,
    });
  };
  const getDictData2 = async () => {
    let { data } = await dictList({
      dictType: "expense_type",
    });
    setDictData({
      ...dictData,
      expenseType: data,
    });
    setExpenseType(data);
  };

  useEffect(() => {
    getDeptList();
    getSalesmanList();
    getDictData();
    getDictData1();
    getDictData2();
    getPageData();
  }, []);

  const getPageData = () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();

    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    if (values.userIdList) values.userIdList = [values.userIdList];

    feePersonList(values).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  };
  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) => index + 1,
    },
    {
      title: "部门",
      dataIndex: "deptName",
      key: "deptName",
    },
    {
      title: "销售人员",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },

    {
      title: "合同额",
      dataIndex: "contractValue",
      key: "contractValue",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },

    {
      title: "已报销",
      dataIndex: "receivedValue",
      key: "receivedValue",
      sorter: (a, b) => a.receivedValue - b.receivedValue,
      render: (value, record) => (
        <Statistic
          value={value}
          valueStyle={{
            fontSize: "12px",
            color: record.isAlarm ? "#cf1322" : "",
          }}
        />
      ),
    },
    {
      title: "报销额度(%)",
      dataIndex: "valueRate",
      key: "valueRate",
    },
    {
      title: "控制额度",
      dataIndex: "controlValue",
      key: "controlValue",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "操作",
      key: "operation",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleDetail(record)}>查看明细</a>
        </Space>
      ),
    },
  ];
  const handleDetail = (record) => {
    setOperate(record);
    setIsModalOpen(true);
  };

  //导出
  const download = () => {
    let values = searchForm.getFieldsValue();

    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    if (values.userIdList) values.userIdList = [values.userIdList];
    feeListPersonExport(values, "报销明细-销售人员");
  };

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
  };

  return (
    <div>
      <div className="search">
        <Form
          layout="inline"
          form={searchForm}
          onFinish={getPageData}
          initialValues={{
            year: new Date().getFullYear(),
          }}
        >
          <Form.Item label="" name="year">
            <Select
              style={{ width: 120 }}
              options={yearList}
              placeholder="年份"
              allowClear
            />
          </Form.Item>

          <Form.Item label="" name="fromType">
            <Select
              style={{ width: 120 }}
              placeholder="数据来源"
              options={fromType}
              allowClear
              fieldNames={{ label: "dictLabel", value: "dictValue" }}
            />
          </Form.Item>
          <Form.Item label="" name="typeList">
            <Select
              style={{ width: 120 }}
              placeholder="报销类型"
              options={expenseType}
              allowClear
              fieldNames={{ label: "dictLabel", value: "dictValue" }}
            />
          </Form.Item>
          <Form.Item label="" name="feeTypeList">
            <Select
              style={{ width: 120 }}
              placeholder="费用类型"
              options={feeType}
              allowClear
              fieldNames={{ label: "dictLabel", value: "dictValue" }}
            />
          </Form.Item>
          {/* <Form.Item label="" name="valueList">
            <Select
              style={{ width: 120 }}
              options={[
                {
                  label: "0~2000",
                  value: "0,2000",
                },
                {
                  label: "2000~5000",
                  value: "2000,5000",
                },

                {
                  label: "5000~8000",
                  value: "5000,8000",
                },

                {
                  label: "8000以上",
                  value: "8000",
                },
              ]}
              placeholder="报销金额"
              allowClear
            />
          </Form.Item> */}
          <Form.Item label="" name="deptIdList">
            <TreeSelect
              showSearch
              style={{ width: 300 }}
              placeholder="部门"
              allowClear
              treeDefaultExpandAll
              treeData={deptList}
              fieldNames={{
                label: "label",
                value: "id",
              }}
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={download}>导出</Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id}
      />
      {/* 表单 */}
      {isModalOpen && (
        <TablePopup
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          operate={{
            ...searchForm.getFieldsValue(),
            userIdList: [operate.ownerUserId],
          }}
        />
      )}
    </div>
  );
}

export default Salers;
