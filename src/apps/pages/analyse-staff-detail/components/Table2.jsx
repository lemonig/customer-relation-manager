import React, { useEffect, useState } from "react";
import { Table, Tooltip, Statistic } from "antd";
import { advanceDeal as advanceDealApi } from "@Api/analyse_staff";
import { useParams, NavLink } from "react-router-dom";
import SdTitle from "@Components/SdTitle";
import { InfoCircleFilled } from "@ant-design/icons";

function Table1({ clickCallback }) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [column, setColumn] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  // Fetch or generate your data here and update the state
  async function getPageData() {
    let res = await advanceDealApi({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        userId: id,
      },
    });

    setData(res.data);
    setLoading(false);
    let temp = [
      {
        title: "序号",
        key: "index",
        width: 60,
        render: (_, record, index) =>
          pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
          index +
          1,
      },
      ...res.additional_data.columnList.map((item) => ({
        title: item.label,
        dataIndex: item.key,
        key: item.key,
        render: (value) => tableRender(value, clickCallback),
      })),
    ];
    setColumn(temp);
    setPagemsg({
      ...pageMsg,
      pagination: {
        ...pageMsg.pagination,
        total: res.additional_data.pagination.total,
      },
    });
  }

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };
  const $title = () => (
    <>
      <span className="margin-right-5">商机推进</span>
      <Tooltip title="进行中商机里，发生销售阶段变化的商机，按变化时间排序">
        <span style={{ fontSize: "14px", cursor: "pointer" }}>
          <InfoCircleFilled style={{ color: "rgba(0,0,0,0.4)" }} />
        </span>
      </Tooltip>
    </>
  );
  return (
    <div>
      <SdTitle title={$title()} />
      <Table
        columns={column}
        dataSource={data}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          ...pageMsg.pagination,
        }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default Table1;

function tableRender(value, clickCallback) {
  if (!value) {
    return "-";
  }
  if ("id" in value) {
    return (
      <NavLink onClick={() => clickCallback(value.value, value.id)}>
        {value.value}
      </NavLink>
    );
  }
  if (["key_2"].includes(value.key)) {
    return <Statistic value={value.value} valueStyle={{ fontSize: "12px" }} />;
  }

  return <>{<span>{value.value}</span>}</>;
}
