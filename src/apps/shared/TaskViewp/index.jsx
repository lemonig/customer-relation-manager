import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "antd";
import { activityPage } from "@Api/dashboard.js";
import DrawerTask from "@Shared/DrawerTask";
import DrawerDeal from "@Shared/DrawerDeal";
import DrawerCustomer from "@Shared/DrawerCustomer";
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
  const [drawerVis, setDrawerVis] = useState({
    task: false,
    deal: false,
    linkman: false,
    customer: false,
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
      title: "销售人员",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
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
      render: (val, { dealId }) => {
        return (
          <a
            onClick={() => {
              setOperateId(dealId);
              setOperateTxt(val);
              setDrawerVis({
                ...drawerVis,
                deal: true,
              });
            }}
          >
            {val}
          </a>
        );
      },
    },

    {
      title: "客户",
      dataIndex: "orgName",
      key: "orgName",
      render: (val, { orgId }) => {
        return (
          <a
            onClick={() => {
              setOperateId(orgId);
              setOperateTxt(val);
              setDrawerVis({
                ...drawerVis,
                customer: true,
              });
            }}
          >
            {val}
          </a>
        );
      },
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
    activityPage({
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
  //

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

      {drawerVis.deal && (
        <DrawerDeal
          width="800"
          visible={drawerVis.deal}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              deal: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}

      {drawerVis.customer && (
        <DrawerCustomer
          width="800"
          visible={drawerVis.customer}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              customer: false,
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
