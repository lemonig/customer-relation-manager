import React, { useState, useEffect } from "react";
import {
  Input,
  InputNumber,
  Button,
  Space,
  Table,
  Form,
  Tooltip,
  PageHeader,
  Statistic,
  DatePicker,
} from "antd";
import { contractOpsPage } from "@Api/contract.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { salesmanList } from "@Api/set_user";
import SetForm from "./components/SetForm";
import { InfoCircleFilled, EyeOutlined } from "@ant-design/icons";
import StaffTree from "@Shared/StaffTree";
import DrawerContractOps from "@Shared/DrawerContractOps";
import { useNavigate, NavLink } from "react-router-dom";

function MsgCooprate() {
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState("");
  const [searchForm] = Form.useForm();
  const [userId, setUserId] = useState([]);
  const [treeVis, setTreeVis] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drawerVis, setDrawerVis] = useState({
    contractOps: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize, pageMsg?.order]);

  useEffect(() => {
    getPageData();
  }, [userId]);

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
    values.type = 1;
    contractOpsPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      sort: pageMsg.order ? [`${pageMsg.field},${pageMsg.order}`] : undefined,
      data: {
        userIdList: userId,
        ...values,
      },
    }).then((res) => {
      setData(res.data);
      setTotal(res.additional_data.total);
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
  const handleTableChange = (pagination, filters, sorter) => {
    setPagemsg({
      pagination,
      filters,
      order: Array.isArray(sorter) ? undefined : sorter.order,
      field: Array.isArray(sorter) ? undefined : sorter.field,
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
      title: "客户",
      dataIndex: "orgName",
      key: "orgName",

      render: (value, record) => (
        <NavLink
          onClick={() => {
            setOperateId(record.id);
            setOperateTxt(record.orgName);
            setDrawerVis({
              ...drawerVis,
              contractOps: true,
            });
          }}
        >
          {value}
        </NavLink>
      ),
    },

    {
      title: "倒计时（天）",
      dataIndex: "leftDays",
      key: "leftDays",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
      sorter: true,
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

  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
  };

  const showPeopleTree = () => {
    setTreeVis(true);
  };
  const getRowSelected = (flag, val) => {
    // dispatch(DELETE_ID());
    setTreeVis(false);
    if (flag) {
      setUserId(val);
    }
  };

  return (
    <div>
      <PageHeader className="site-page-header" title="运维合同-执行中" />
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="合同剩余天数">
            <Form.Item name="minDays" style={{ display: "inline-block" }}>
              <InputNumber min={1} max={10} />
            </Form.Item>
            <span
              style={{
                display: "inline-block",
                width: "24px",
                lineHeight: "32px",
                textAlign: "center",
              }}
            >
              -
            </span>

            <Form.Item name="maxDays" style={{ display: "inline-block" }}>
              <InputNumber min={1} max={10} s />
            </Form.Item>
          </Form.Item>
          <Form.Item label="" name="name">
            <Input placeholder="清输入合同名称、编号等搜索" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="text" onClick={showPeopleTree} icon={<EyeOutlined />}>
              {userId.length ? `已选择 ${userId.length} 人` : "按人员筛选"}
            </Button>
          </Form.Item>
        </Form>

        <div>
          <Button onClick={handleAdd}>预警设置</Button>
        </div>
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
      {isModalOpen && <SetForm open={isModalOpen} closeModal={closeModal} />}
      <StaffTree open={treeVis} getRowSelected={getRowSelected} />
      {drawerVis.contractOps && (
        <DrawerContractOps
          width="1000"
          visible={drawerVis.contractOps}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              contractOps: false,
            })
          }
          id={operateId}
          title={operateTxt}
          word={"orgId"}
        />
      )}
    </div>
  );
}

export default MsgCooprate;
