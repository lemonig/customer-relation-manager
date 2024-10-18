import React, { useState, useEffect, useContext } from "react";
import {
  Input,
  Button,
  Space,
  Table,
  Modal,
  message,
  PageHeader,
  DatePicker,
  Form,
  Tooltip,
} from "antd";

import moment from "moment";
import { actPage as activitypage } from "@Api/act_adm.js";
import { Context } from "../index";

function Tab1() {
  const { id, time, word } = useContext(Context);

  const [activeData, setActiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);
  const getPageData = () => {
    setLoading(true);
    activitypage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        statusList: ["2"],
        [word]: [id],
        startTimeBeginTime: time.beginTime,
        startTimeEndTime: time.endTime,
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

  const columns = [
    {
      title: "序号",
      key: "index",
      width: 70,
      fixed: true,
      render: (_, record, idx) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        idx +
        1,
    },
    {
      title: "任务类型",
      dataIndex: "typeName",
      key: "typeName",
      width: 100,
      fixed: "left",
    },
    {
      title: "开始日期",
      dataIndex: "startTime",
      key: "startTime",
      width: 100,
    },
    {
      title: "商机名称",
      key: "dealName",
      dataIndex: "dealName",
      width: 150,
    },
    {
      title: "客户",
      dataIndex: "orgName",
      key: "orgName",
      width: 150,
    },
    {
      title: "费用",
      dataIndex: "fee",
      key: "fee",
      width: 100,
    },

    {
      title: "联系人",
      dataIndex: "personName",
      key: "personName",
      width: 100,
    },
    {
      title: "标题",
      dataIndex: "subject",
      key: "subject",
      width: 150,
    },
    {
      title: "纪要",
      dataIndex: "description",
      key: "description",
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (val) => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },

    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 150,
    },
  ];

  const handleTableChange = (pagination, filters, sorter, extra) => {
    // if filters not changed, don't update pagination.current

    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  return (
    <div>
      <style jsx="true">
        {`
          .p-elipse {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 300px;
          }
        `}
      </style>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          ...pageMsg.pagination,
        }}
        scroll={{ x: columns.length * 150 }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        onHeaderCell={() => "onHeaderCell"}
      />
    </div>
  );
}

export default Tab1;
