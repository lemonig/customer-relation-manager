import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Typography,
  Tooltip,
  PageHeader,
} from "antd";
import {
  customerInfo,
  customerDelete,
  customerUpdate,
  customerAdd,
} from "@Api/info_customer.js";
import { ExclamationCircleOutlined, DownOutlined } from "@ant-design/icons";
import FormCum from "./components/FormCum";
import DrawerCustomer from "@Shared/DrawerCustomer";
import DrawerLinkman from "@Shared/DrawerLinkman";
const { Option } = Select;

function MsgCustomer() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchVal, setSearchVal] = useState("");
  const [data, setData] = useState([]);
  const [drawerVis, setDrawerVis] = useState({
    customer: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);
  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);

  const showModal = () => {
    setIsModalOpen(true);
  };

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
    customerInfo({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      sort: pageMsg.order ? [`${pageMsg.field},${pageMsg.order}`] : undefined,
      data: {
        name: searchVal,
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

  // 删除
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法回复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await customerDelete({ id });
        if (success) {
          message.success("删除成功");
          setIsModalOpen(false);
          getPageData();
        } else {
          message.error(msg);
        }
      },
    });
  };
  // 新建
  const handleAdd = () => {
    setOperate(null);
    setIsModalOpen(true);
  };
  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    setIsModalOpen(true);
  };

  const columns = [
    // {
    //   title: "序号",
    //   key: "index",
    //   width: 60,
    //   render: (_, record, index) =>
    //     pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
    //     index +
    //     1,
    // },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 100,
      render: (val, { id }) => {
        return (
          <a
            onClick={() => {
              setOperateId(id);
              setOperateTxt(val);
              setDrawerVis({
                ...drawerVis,
                linkman: true,
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
      fixed: "left",
      width: 200,
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
      title: "手机",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "职务",
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    {
      title: "部门",
      dataIndex: "department",
      key: "department",
    },

    {
      title: "关键决策人",
      dataIndex: "isKdm",
      key: "isKdm",
      render: (val) => (val ? "是" : "否"),
    },
    {
      title: "备注",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },

    {
      title: "商机数量",
      dataIndex: "dealNum",
      key: "dealNum",
      sorter: true,
    },

    {
      title: "跟进次数",
      dataIndex: "activityNum",
      key: "activityNum",
      sorter: true,
    },

    {
      title: "任务费用",
      dataIndex: "activityFee",
      key: "activityFee",
      sorter: true,
    },
    {
      title: "最近跟进时间",
      dataIndex: "latestFollowUpTime",
      key: "latestFollowUpTime",
      sorter: true,
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

    // {
    //   title: "电子邮箱",
    //   dataIndex: "email",
    //   key: "email",
    // },
    // {
    //   title: "性别",
    //   dataIndex: "gender",
    //   key: "gender",
    //   render: (val) => (val == 1 ? "男" : "女"),
    // },

    // {
    //   title: "地址",
    //   dataIndex: "address",
    //   key: "address",
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (address) => (
    //     <Tooltip placement="topLeft" title={address}>
    //       {address}
    //     </Tooltip>
    //   ),
    // },

    // {
    //   title: "操作",
    //   key: "operation",
    //   fixed: "right",
    //   render: (_, record) => (
    //     <Space>
    //       <a onClick={() => handleEdit(record)}>编辑</a>
    //       <a onClick={() => handleDel(record)}>删除</a>
    //     </Space>
    //   ),
    // },
  ];

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchVal(value);
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
    <div>
      <PageHeader className="site-page-header" title="联系人管理" />
      <div className="search">
        <Space>
          <Input
            placeholder="请输入姓名、联系电话"
            style={{ width: 240 }}
            // value={searchVal}
            onChange={handleInputChange}
          />

          <Button type="primary" onClick={search}>
            查询
          </Button>
          <Button onClick={handleAdd}>新建</Button>
        </Space>
      </div>
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
        scroll={{
          x: columns.length * 150,
        }}
        title={() => (
          <div style={{ textAlign: "right", fontSize: "12px" }}>
            共{pageMsg.pagination.total}项数据
          </div>
        )}
      />
      {/* 弹出表单 */}
      {isModalOpen && (
        <FormCum open={isModalOpen} closeModal={closeModal} record={operate} />
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
      {drawerVis.linkman && (
        <DrawerLinkman
          width="800"
          visible={drawerVis.linkman}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              linkman: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}
    </div>
  );
}
export default MsgCustomer;
