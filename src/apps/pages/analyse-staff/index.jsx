import React, { useState, useEffect } from "react";
import { Button, Table, PageHeader, DatePicker, Form, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { countByPerson as countByPersonApi } from "@Api/analyse_staff";
import { InfoCircleFilled } from "@ant-design/icons";

import { NavLink } from "react-router-dom";
const { RangePicker } = DatePicker;

function DealList() {
  let navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [column, setColumn] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

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
    let values = searchForm.getFieldsValue();
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginYear = moment(values.time[0]).format("YYYY");
      values.endYear = moment(values.time[1]).format("YYYY");
    }

    countByPersonApi({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
    }).then((res) => {
      setData(res.data);
      setLoading(false);
      let temp = [
        {
          title: "序号",
          key: "index",
          width: 60,
          fixed: "left",
          render: (_, record, index) =>
            pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
            index +
            1,
        },
        ...res.additional_data.columnList.map((item, idx) => ({
          fixed: idx == 0 ? "left" : false,
          title: item.label,
          dataIndex: item.key,
          key: item.key,
          render: (value) => tableRender(value),
        })),
      ];

      setColumn(temp);
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          total: res.additional_data.pagination.total,
        },
      });
    });
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
    <div className="deal-page">
      <PageHeader
        className="site-page-header"
        title={
          <>
            <span>按人员统计</span>
            <Tooltip title="统计各人员在商机各个阶段任务产生的费用和OA报销费用">
              <span style={{ fontSize: "14px", cursor: "pointer" }}>
                <InfoCircleFilled />
              </span>
            </Tooltip>
          </>
        }
      />

      <div className="search" style={{ marginBottom: "0px" }}>
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          initialValues={{
            time: [moment().startOf("year"), moment()],
          }}
        >
          <Form.Item label="" name="time">
            <RangePicker picker="year" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        scroll={{
          x: 1300,
        }}
        columns={column}
        dataSource={data}
        loading={loading}
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default DealList;

function tableRender(value) {
  if ("id" in value) {
    return <NavLink to={`/analyseStaff/${value.id}`}>{value.value}</NavLink>;
  }
  return <>{<span>{value.value}</span>}</>;
}
