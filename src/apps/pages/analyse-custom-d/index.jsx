import React, { useState, useEffect } from "react";
import { Space, Table, PageHeader, Switch } from "antd";

import { activity as activityApi } from "@Api/analyse_custom";
import { useParams, useNavigate, NavLink } from "react-router-dom";

function Index() {
  let navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);

  const [showFee, setShowFee] = useState(false);

  useEffect(() => {
    getPageData(showFee);
  }, []);
  const getPageData = (param) => {
    setLoading(true);
    activityApi({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        orgId: id,
        showFee: param,
      },
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
      dataIndex: "personName",
      key: "personName",
    },
    {
      title: "任务开始时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "任务描述",
      dataIndex: "description",
      key: "description",
      render: (value, record) => (
        <div className="p-elipse">{value ?? "--"}</div>
      ),
    },
    {
      title: "完成纪要",
      dataIndex: "participant",
      key: "participant",
    },
    {
      title: "实际费用",
      dataIndex: "fee",
      key: "fee",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "商机",
      dataIndex: "deal",
      key: "deal",
      render: (value, rec) => (
        <NavLink to={`/pipeline?pipelineId=${value.id}`}>{value.name}</NavLink>
      ),
    },
    {
      title: "客户",
      dataIndex: "organization",
      key: "organization",
      render: (value, rec) => <span>{value.name}</span>,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "完成时间",
      dataIndex: "endTime",
      key: "endTime",
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

  const onSwitchChange = (checked) => {
    setShowFee(checked);
    getPageData(checked);
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
      <PageHeader
        className="site-page-header"
        style={{ padding: "0 24px" }}
        onBack={() => navigate(-1, {})}
        title={"任务历史-" + data[0]?.organization.name}
        extra={[
          <Space>
            只看发生费用任务:
            <Switch onChange={onSwitchChange} checked={showFee} />
          </Space>,
        ]}
      />
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

export default Index;