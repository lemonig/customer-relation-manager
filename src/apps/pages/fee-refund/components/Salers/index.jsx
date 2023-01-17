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
} from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import TablePopup from "./components/TablePopup";

function Salers() {
  let navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);
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
    // setLoading(true);
    let values = searchForm.getFieldsValue();
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYYMMDD");
      values.endTime = moment(values.time[1]).format("YYYYMMDD");
    }
    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    if (values.userIdList) values.userIdList = [values.userIdList];
    if (values.valueList) values.valueList = values.valueList.split(",");

    // dealPage({
    //   page: pageMsg.pagination.current,
    //   size: pageMsg.pagination.pageSize,
    //   data: values,
    // }).then((res) => {
    //   setData(res.data);
    //   setLoading(false);
    //   setPagemsg({
    //     ...pageMsg,
    //     pagination: {
    //       ...pageMsg.pagination,
    //       total: res.additional_data.pagination.total,
    //     },
    //   });
    // });
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
      dataIndex: "code",
      key: "code",
    },
    {
      title: "销售人员",
      dataIndex: "code",
      key: "code",
    },

    {
      title: "合同额",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "已报销",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "报销额度（%）",
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: "控制额度",
      dataIndex: "value",
      key: "value",
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
        <a onClick={() => handleDedail(record)}>查看明细</a>
      ),
    },
  ];

  const handleDedail = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="search" style={{ marginBottom: "0px" }}>
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="valueList">
            <Select
              style={{ width: 120 }}
              options={[
                {
                  label: "1000万以上",
                  value: "10000000",
                },
                {
                  label: "500~1000万",
                  value: "5000000,10000000",
                },
                {
                  label: "100~500万",
                  value: "1000000,5000000",
                },
                {
                  label: "0~100万",
                  value: "0,1000000",
                },
              ]}
              placeholder="预计金额"
              allowClear
            />
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
      {/* 员工弹窗 */}
      {isModalOpen && (
        <TablePopup
          isModalOpen={isModalOpen}
          closeModal={closeUserModal}
          id={selectedRow[0]}
        />
      )}
    </div>
  );
}

export default Salers;
