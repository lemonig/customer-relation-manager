import React, { useContext, useState, useEffect } from "react";
import SdDrawer from "@Components/SdDrawer";
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
  Tooltip,
  Statistic,
  TreeSelect,
  Tabs,
} from "antd";
import { contractOpsPage } from "@Api/contract.js";
export const Context = React.createContext();

function Index(props) {
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
    contractOpsPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        [props.word]: props.id,
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
      title: "所属销售",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },

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
      title: "合同类型",
      dataIndex: "signedTypeName",
      key: "signedTypeName",
    },
    {
      title: "合同状态",
      dataIndex: "stateName",
      key: "stateName",
    },
    {
      title: "续约次数",
      dataIndex: "renewalCount",
      key: "renewalCount",
    },
    {
      title: "工程项目经理",
      dataIndex: "projectManager",
      key: "projectManager",
    },
    {
      title: "合同开始时间",
      dataIndex: "opsStartDate",
      key: "opsStartDate",
    },
    {
      title: "合同结束时间",
      dataIndex: "opsEndDate",
      key: "opsEndDate",
    },

    {
      title: "合同金额",
      dataIndex: "total",
      key: "total",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "运维费用",
      dataIndex: "opsMoney",
      key: "opsMoney",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },

    {
      title: "站点数量",
      dataIndex: "stationCount",
      key: "stationCount",
    },
    {
      title: "更新时间",
      dataIndex: "gmtModified",
      key: "gmtModified",
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
    <Context.Provider value={props.id}>
      <SdDrawer
        {...props}
        title={<PageHeader className="site-page-header" title={props.title} />}
      >
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
        />
      </SdDrawer>
    </Context.Provider>
  );
}

export default Index;
