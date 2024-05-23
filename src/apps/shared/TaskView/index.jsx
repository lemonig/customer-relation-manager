import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "antd";
import { actPage } from "@Api/act_adm.js";
import DrawerTask from "@Shared/DrawerTask";

function TaskView({ open, getRowSelected, params: { time, id } }) {
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);

  const [drawerVis, setDrawerVis] = useState({
    task: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  const columns = [
    {
      title: "任务类型",
      dataIndex: "typeName",
      key: "typeName",
      fixed: "left",
      render: (val, { id }) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setOperateId(id);
              setOperateTxt(val);
              setDrawerVis({
                ...drawerVis,
                task: true,
              });
            }}
          >
            {val}
          </Button>
        );
      },
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      sorter: true,
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
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];

  const getPageData = () => {
    setLoading(true);

    actPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        startTimeBeginTime: time,
        startTimeEndTime: time,
        typeIdList: pageMsg?.filters?.typeName,
        statusList: pageMsg?.filters?.status,
        userIdList: [id],
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
  //

  return (
    <>
      {open && (
        <Modal
          title="任务"
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
      )}{" "}
      {drawerVis.task && (
        <DrawerTask
          width="800"
          visible={drawerVis.task}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              task: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}
    </>
  );
}

export default TaskView;
