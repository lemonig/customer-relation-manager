import React, { useState, useEffect } from "react";
import { Table, Modal, Tooltip, Statistic } from "antd";
import { contractPage } from "@Api/dashboard.js";

function TaskView({
  open,
  getRowSelected,
  params: { type, label, timeBy, userIdList },
}) {
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

  const columns = [
    {
      title: "合同编号",
      dataIndex: "code",
      key: "code",
    },

    {
      title: "合同名称",
      dataIndex: "name",
      key: "name",
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: "销售人员",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },
    {
      title: "客户名称",
      dataIndex: "orgName",
      key: "orgName",
      ellipsis: {
        showTitle: false,
      },
      render: (orgName) => (
        <Tooltip placement="topLeft" title={orgName}>
          {orgName}
        </Tooltip>
      ),
    },

    {
      title: "合同金额",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "已收金额",
      dataIndex: "receivedValue",
      key: "receivedValue",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "未收金额",
      dataIndex: "unreceivedValue",
      key: "unreceivedValue",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "已开票金额",
      dataIndex: "invoicedValue",
      key: "invoicedValue",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "已开票未收款",
      dataIndex: "invoicedUnreceivedValue",
      key: "invoicedUnreceivedValue",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "签约日期",
      dataIndex: "signedDate",
      key: "signedDate",
    },
  ];

  const getPageData = () => {
    setLoading(true);
    contractPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        type,
        timeBy,
        userIdList,
        filterBy: 4,
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

  const handleTableChange = (pagination, filters, sorter, extra) => {
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  return (
    <>
      {open && (
        <Modal
          title={label}
          open={open}
          onOk={() => getRowSelected(false)}
          onCancel={() => getRowSelected(false)}
          width={1200}
          destroyOnClose
          bodyStyle={{
            padding: "8px",
          }}
          style={{
            top: "0px",
          }}
          footer={null}
        >
          <div>
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
              title={() => (
                <div style={{ textAlign: "right", fontSize: "12px" }}>
                  共{pageMsg.pagination.total}项数据
                </div>
              )}
              onHeaderCell={() => "onHeaderCell"}
            />
          </div>
        </Modal>
      )}
    </>
  );
}

export default TaskView;
