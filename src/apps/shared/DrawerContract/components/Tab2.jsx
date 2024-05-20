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
  Statistic,
} from "antd";

import moment from "moment";
import { dealPage } from "@Api/deal_list";

function Tab2({ id, word }) {
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
    dealPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        [word]: id,
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
      title: "商机名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "商机金额（元）",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },

    {
      title: "客户",
      dataIndex: "orgName",
      key: "orgName",
    },

    {
      title: "商机状态",
      dataIndex: "statusName",
      key: "status",
    },
    {
      title: "商机所有人",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
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
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        onHeaderCell={() => "onHeaderCell"}
      />
    </div>
  );
}

export default Tab2;
