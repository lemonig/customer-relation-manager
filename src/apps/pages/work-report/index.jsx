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
import { salesmanList } from "@Api/set_user";
import { workreportPage, workreportExport } from "@Api/work_report";
import FormRep from "./Form";
import { throttle } from "@Utils/util";
import BtnAuth from "@Shared/BtnAuth";

const { Option } = Select;

function WorkReport() {
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [salerList, setSalerList] = useState([]);
  const [searchForm] = Form.useForm();
  const [formVis, setFormVis] = useState(false);
  let navigate = useNavigate();

  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };

  useEffect(() => {
    getSalesmanList();
  }, []);
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
    workreportPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
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

  const gotoWorkDetail = (id) => {
    navigate({
      pathname: "/workReportDetail",
      search: `?workId=${id}`,
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
      title: "报告编号",
      key: "code",
      render: (_, record) => (
        <Button type="link" onClick={() => gotoWorkDetail(record.id)}>
          {record.code}
        </Button>
      ),
    },
    {
      title: "报告名称",
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
      title: "销售人员",
      dataIndex: "userOwnerName",
      key: "userOwnerName",
    },

    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },

    {
      title: "操作",
      key: "operation",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space>
          {record.url ? (
            <a onClick={() => throttleDownload(record)}>下载</a>
          ) : null}
        </Space>
      ),
    },
  ];

  const downloadPage = async (record) => {
    await workreportExport(
      {
        id: record.id,
      },
      record.name
    );
  };
  const throttleDownload = throttle(downloadPage, 500);

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
    setFormVis(false);
    if (flag) getPageData();
  };
  return (
    <div>
      <PageHeader className="site-page-header" title="工作报告" />
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="name">
            <Input
              placeholder="请输入工作报告名称"
              style={{ width: 240 }}
              // value={searchVal}
            />
          </Form.Item>
          <Form.Item label="" name="userIdList">
            <Select
              style={{ width: 200 }}
              options={salerList}
              placeholder="销售人员"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <BtnAuth word="activity:workreport:create">
                <Button onClick={() => setFormVis(true)}>新建</Button>
              </BtnAuth>
            </Space>
          </Form.Item>
        </Form>
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
      />
      {/* 弹出表单 */}
      <FormRep open={formVis} closeModal={closeModal} />
    </div>
  );
}

export default WorkReport;
