import React, { useState, useEffect } from "react";
import { Input, Button, Table, PageHeader, Form } from "antd";
import { useNavigate, NavLink } from "react-router-dom";
import { countByOrg as countByOrgApi } from "@Api/analyse_custom";

function Index() {
  let navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
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
    let values = searchForm.getFieldsValue();

    countByOrgApi({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
    }).then((res) => {
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
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };
  function gotoDetail(params) {
    navigate(`/analyseCustom/${params.id}`, { state: { name: params.value } });
  }
  function tableRender(value) {
    if (!value) {
      return "-";
    }
    if ("id" in value) {
      return (
        <Button type="link" onClick={() => gotoDetail(value)}>
          {value.value}
        </Button>
      );
    }
    return <>{<span>{value.value}</span>}</>;
  }

  return (
    <div className="deal-page">
      <PageHeader className="site-page-header" title="按客户统计" />
      <div className="search" style={{ marginBottom: "0px" }}>
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          initialValues={{}}
        >
          <Form.Item label="" name="name">
            <Input placeholder="请输入客户名称" style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>

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

export default Index;
