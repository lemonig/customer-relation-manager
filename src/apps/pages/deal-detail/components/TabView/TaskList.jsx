import React, { useState, useEffect } from "react";
import { Table } from "antd";

import { dealList } from "@Api/deal_list";
import { useSearchParams } from "react-router-dom";

function TaskList() {
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);

  const [getParams, setParam] = useSearchParams();
  const pipelineId = getParams.getAll("pipelineId")[0];

  useEffect(() => {
    getPageData();
  }, []);
  const getPageData = () => {
    setLoading(true);
    dealList({
      id: pipelineId,
    }).then((res) => {
      setData(res.data);
      setLoading(false);
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
      title: "状态",
      dataIndex: "statusName",
      key: "statusName",
    },
    {
      title: "任务编号",
      dataIndex: "code",
      key: "code",
      width: 150,
    },
    {
      title: "任务类型",
      dataIndex: "typeName",
      key: "typeName",
    },

    {
      title: "客户联系人",
      dataIndex: "personName",
      key: "personName",
    },

    {
      title: "参与人员",
      dataIndex: "participant",
      key: "participant",
    },
    {
      title: "任务开始时间",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "任务描述",
      dataIndex: "subject",
      key: "subject",
      render: (value, record) => (
        <div className="p-elipse">{value ?? "--"}</div>
      ),
    },
    {
      title: "完成纪要",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "费用",
      dataIndex: "fee",
      key: "fee",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "完成时间",
      dataIndex: "doneTime",
      key: "doneTime",
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

export default TaskList;
