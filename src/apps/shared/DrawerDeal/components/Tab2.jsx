import React, { useState, useEffect, useContext } from "react";
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

import moment from "moment";
import { personPage } from "@Api/deal_list";
import { DealContext } from "../index";
import { ExclamationCircleFilled } from "@ant-design/icons";

function Tab2({ id, word }) {
  // const id = useContext(DealContext);
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
    personPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        [word]: id,
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
      title: "姓名",
      dataIndex: "name",
      key: "name",
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
      title: "创建人",
      dataIndex: "createUserName",
      key: "createUserName",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
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

  const getRowClassName = ({ isRelated }, index) => {
    return isRelated ? "row-color-1" : "";
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

          .row-color-1 {
            background-color: #f0f8ff;
            font-weight: bold;
          }
        `}
      </style>
      <p>
        <ExclamationCircleFilled />
        高亮显示的联系人为商机关联的联系人，其余为商机关联客户其他的联系人
      </p>
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
        rowClassName={getRowClassName}
      />
    </div>
  );
}

export default Tab2;
