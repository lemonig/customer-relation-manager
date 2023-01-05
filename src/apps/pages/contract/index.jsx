import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Form,
  Tooltip,
  PageHeader,
  Statistic,
} from "antd";
import { contractPage } from "@Api/contract.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

function MsgCooprate() {
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchVal, setSearchVal] = useState("");
  const [data, setData] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);

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
    contractPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
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

  const gotoDealDetail = (id) => {
    navigate({
      pathname: "/pipeline",
      search: `?pipelineId=${id}`,
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
      title: "合同类型",
      dataIndex: "type",
      key: "type",
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
      title: "商机编号",
      dataIndex: "dealCode",
      key: "dealCode",
      render: (value, record) => (!!value ? <a>{value}</a> : ""),
      onCell: (record) => ({
        onClick: (event) => {
          if (record.dealCode) {
            gotoDealDetail(record.dealCode);
          }
        },
      }),
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
      title: "签约日期",
      dataIndex: "signedDate",
      key: "signedDate",
    },
    {
      title: "销售人员",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },
    {
      title: "建档日期",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "合同条款",
      dataIndex: "term",
      key: "term",
      ellipsis: {
        showTitle: false,
      },
      render: (term) => (
        <Tooltip placement="topLeft" title={term}>
          {term}
        </Tooltip>
      ),
    },
    {
      title: "合同附件",
      key: "filePath",
      fixed: "right",
      render: (value, record) => (
        <Space>
          <a href={record.filePath} download={record.name}></a>
        </Space>
      ),
    },
  ];

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
      <PageHeader className="site-page-header" title="合同管理" />
      <div className="search">
        <Space>
          <Input
            placeholder="请输入商机名称、合同名称、合同编号"
            style={{ width: 240 }}
            // value={searchVal}
            onChange={handleInputChange}
          />
          <Button type="primary" onClick={search}>
            查询
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
      {/* 弹出表单 */}
    </div>
  );
}

export default MsgCooprate;
