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
import { feeList, feeListExport } from "@Api/fee-refund";
import { dictList } from "@Api/public";
import { deptList as deptListApi } from "@Api/set_dept.js";
import { arrayToTree } from "@Utils/util";
import { salesmanList } from "@Api/set_user";
const { RangePicker } = DatePicker;
let yearList = [];
for (let i = 2018; i < moment().year() + 1; i++) {
  yearList.unshift({
    label: `${i}年`,
    value: i,
  });
}

function Summary() {
  let navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [salerList, setSalerList] = useState([]);
  const [dictData, setDictData] = useState({
    feeType: [], // 费用类型
    fromType: [], //数据来源
    expenseType: [], //报销类型
  });
  const [expenseType, setExpenseType] = useState([]);
  const [fromType, setFromType] = useState([]);
  const [feeType, setFeeType] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

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
    getSalesmanList();
    getDictData();
    getDictData1();
    getDictData2();
  }, []);
  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

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
    let values = searchForm.getFieldsValue();
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYYMMDD");
      values.endTime = moment(values.time[1]).format("YYYYMMDD");
    }
    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    if (values.userIdList) values.userIdList = [values.userIdList];
    if (values.valueList) values.valueList = values.valueList.split(",");

    feeList({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
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
      title: "数据来源",
      dataIndex: "fromTypeName",
      key: "fromTypeName",
    },
    {
      title: "报销单号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "部门",
      dataIndex: "deptName",
      key: "deptName",
    },
    {
      title: "报销人",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },
    {
      title: "报销类型",
      dataIndex: "expenseTypeName",
      key: "expenseTypeName",
    },

    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "项目编码",
      dataIndex: "projectCode",
      key: "projectCode",
    },
    {
      title: "商机名称",
      dataIndex: "dealName",
      key: "dealName",
    },
    {
      title: "客户公司",
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: "费用类型",
      dataIndex: "feeTypeName",
      key: "feeTypeName",
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "报销金额",
      dataIndex: "feeValue",
      key: "feeValue",
      render: (feeValue, record) => (
        <Statistic value={feeValue} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "提交时间",
      dataIndex: "submitTime",
      key: "submitTime",
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  //导出
  const download = () => {
    let values = searchForm.getFieldsValue();
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYYMMDD");
      values.endTime = moment(values.time[1]).format("YYYYMMDD");
    }
    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    if (values.userIdList) values.userIdList = [values.userIdList];
    if (values.valueList) values.valueList = values.valueList.split(",");
    feeListExport(values, "报销明细");
  };

  return (
    <div>
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="name">
            <Input placeholder="请输入费用报销单号、商机名称、客户公司、报销人" />
          </Form.Item>
          {/* <Form.Item label="" name="year">
            <Select
              style={{ width: 120 }}
              options={yearList}
              placeholder="年份"
              allowClear
            />
          </Form.Item> */}
          <Form.Item label="" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item label="" name="fromTypeList">
            <Select
              style={{ width: 200 }}
              placeholder="数据来源"
              options={fromType}
              allowClear
              fieldNames={{ label: "dictLabel", value: "dictValue" }}
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item label="" name="expenseTypeList">
            <Select
              style={{ width: 200 }}
              placeholder="报销类型"
              options={expenseType}
              allowClear
              fieldNames={{ label: "dictLabel", value: "dictValue" }}
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item label="" name="feeTypeList">
            <Select
              style={{ width: 200 }}
              placeholder="费用类型"
              options={feeType}
              allowClear
              fieldNames={{ label: "dictLabel", value: "dictValue" }}
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item label="" name="valueList">
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
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default Summary;
