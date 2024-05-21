import React, { useState, useEffect } from "react";
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
import { dealLogs } from "@Api/deal_list";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

function Logs() {
  const [getParams, setParam] = useSearchParams();
  const pipelineId = getParams.getAll("pipelineId")[0];
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
    dealLogs({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        dealId: pipelineId,
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
      width: 60,
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
    },
    {
      title: "变更时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "变更人",
      dataIndex: "createUserName",
      key: "createUserName",
    },
    {
      title: "变更字段",
      dataIndex: "propertyList",
      key: "propertyList",
      render: (value, record) =>
        value.map((item) => <div className="p-elipse">{item ?? "--"}</div>),
    },

    {
      title: "变更前",
      dataIndex: "beforeList",
      key: "beforeList",
      render: (value, record) =>
        value.map((item) => <div className="p-elipse">{item ?? "--"}</div>),
    },

    {
      title: "变更后",
      dataIndex: "afterList",
      key: "afterList",
      render: (value, record) =>
        value.map((item) => <div className="p-elipse">{item ?? "--"}</div>),
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
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        onHeaderCell={() => "onHeaderCell"}
      />
    </div>
  );
}

export default Logs;
