import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  message,
  Tooltip,
  PageHeader,
  Statistic,
} from "antd";
import { companyInfo, companyDelete } from "@Api/info_company.js";
import { tianyancha } from "@Api/public.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { organize } from "@Utils/data";
import FormComy from "./components/FormComy";
import DrawerCustomer from "@Shared/DrawerCustomer";
const { Option } = Select;

function MsgCompany() {
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
  const [selectVal, setSelectVal] = useState("");
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
    // FIXME 第一页会不触发hooks,故分开
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
    companyInfo({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      sort: pageMsg.order ? [`${pageMsg.field},${pageMsg.order}`] : undefined,
      data: {
        name: searchVal,
        // orgType: selectVal,
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
        let { success, message: msg } = await companyDelete({ id });
        if (success) {
          message.success("删除成功");
          setIsModalOpen(false);
          getPageData();
        } else {
          message.error("删除失败");
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

  // 弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false);
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
      title: "客户名称",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (val, { id: orgId }) => {
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
      title: "省份",
      dataIndex: "province",
      key: "province",
    },
    {
      title: "商机数量",
      dataIndex: "dealNum",
      key: "dealNum",
      sorter: true,
    },
    {
      title: "进行中商机额",
      dataIndex: "processDealValue",
      key: "processDealValue",
      sorter: true,
      render: (val) => (
        <Statistic value={val} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "赢单商机额",
      dataIndex: "winDealValue",
      key: "winDealValue",
      sorter: true,
      render: (val) => (
        <Statistic value={val} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "流失商机额",
      dataIndex: "unWinDealValue",
      key: "unWinDealValue",
      sorter: true,
      render: (val) => (
        <Statistic value={val} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "任务数量",
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
    // {
    //   title: "机构类型",
    //   dataIndex: "orgType",
    //   key: "orgType",
    //   render: (value) => {
    //     let res = organize.filter((ele) => ele.value == value);
    //     return res[0].label;
    //   },
    // },
    {
      title: "最近跟进时间",
      dataIndex: "latestFollowUpTime",
      key: "latestFollowUpTime",
      sorter: true,
    },
    {
      title: "合同数量",
      dataIndex: "contractNum",
      key: "contractNum",
      sorter: true,
    },
    {
      title: "合同签订额",
      dataIndex: "contractValue",
      key: "contractValue",
      sorter: true,
      render: (val) => (
        <Statistic value={val} valueStyle={{ fontSize: "12px" }} />
      ),
    },
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
    //   title: "统一社会信用代码",
    //   dataIndex: "creditCode",
    //   key: "creditCode",
    // },
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
    //   title: "操作",
    //   key: "operation",
    //   width: 100,
    //   fixed: "right",
    //   render: (_, record) => (
    //     <Space>
    //       <a onClick={() => handleEdit(record)}>编辑</a>
    //       <a onClick={() => handleDel(record)}>删除</a>
    //     </Space>
    //   ),
    // },
  ];

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchVal(value);
  };
  const handleSelectChange = (value) => {
    setSelectVal(value);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
  };

  return (
    <div>
      <PageHeader className="site-page-header" title="客户管理" />
      <div className="search">
        <Space>
          <Input
            placeholder="请输入客户名称"
            style={{ width: 240 }}
            // value={searchVal}
            onChange={handleInputChange}
          />

          <Button type="primary" onClick={search}>
            查询
          </Button>
          {/* <Button onClick={handleAdd}>新建</Button> */}
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
        <FormComy open={isModalOpen} closeModal={closeModal} record={operate} />
      )}
      {drawerVis.customer && (
        <DrawerCustomer
          width="1000"
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
    </div>
  );
}

export default MsgCompany;
