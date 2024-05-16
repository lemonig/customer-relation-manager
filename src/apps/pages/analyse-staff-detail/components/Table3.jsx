import React, { useEffect, useState } from "react";
import { Table, Tooltip } from "antd";
import { noChangeDeal as noChangeDealApi } from "@Api/analyse_staff";
import { useParams, NavLink } from "react-router-dom";
import SdTitle from "@Components/SdTitle";
import { InfoCircleFilled } from "@ant-design/icons";

function Table1() {
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
    let res = await noChangeDealApi({
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
        render: (value) => tableRender(value),
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
      <span>停滞商机</span>
      <Tooltip title="在某个销售阶段停留时间过长的进行汇商机，按进入销售阶段的时间排序">
        <span style={{ fontSize: "14px", cursor: "pointer" }}>
          <InfoCircleFilled />
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
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default Table1;

function tableRender(value) {
  if (!value) {
    return "-";
  }
  if ("id" in value) {
    return (
      <NavLink to={`/pipeline?pipelineId=${value.id}`}>{value.value}</NavLink>
    );
  }
  return <>{<span>{value.value}</span>}</>;
}
