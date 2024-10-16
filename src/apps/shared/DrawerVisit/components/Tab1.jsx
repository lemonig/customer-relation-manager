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
  Select,
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
        ...time,
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
    },
    {
      title: "商机名称",
      key: "dealName",
      dataIndex: "dealName",
    },
    {
      title: "客户",
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: "费用",
      dataIndex: "fee",
      key: "fee",
    },
    {
      title: "状态",
      dataIndex: "statusName",
      key: "status",
    },

    {
      title: "联系人",
      dataIndex: "personName",
      key: "personName",
    },
    {
      title: "标题",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "纪要",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "创建人",
      dataIndex: "createUserName",
      key: "createUserName",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
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
        scroll={{ x: columns.length * 100 }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        onHeaderCell={() => "onHeaderCell"}
      />
    </div>
  );
}

export default Tab1;
