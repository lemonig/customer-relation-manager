import React, { useState, useEffect } from "react";
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
  Image,
  Switch,
  Statistic,
} from "antd";
import { actPage, actDelete, actExport, actUpdate } from "@Api/act_adm.js";
import { activityOverview } from "@Api/analyse_staff";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { contractPage } from "@Api/dashboard.js";
import IconFont from "@Components/IconFont";
import BtnAuth from "@Shared/BtnAuth";
const { RangePicker } = DatePicker;

function TaskView({
  open,
  getRowSelected,
  params: { type, label, timeBy, userIdList },
}) {
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [showFee, setShowFee] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    // getActiveData();
  }, []);
  useEffect(() => {
    getPageData();
  }, [
    pageMsg.pagination.current,
    pageMsg.pagination.pageSize,
    // JSON.stringify(pageMsg.filters),
  ]);

  //转变完成状态
  const handleChangeOver = async (id, val) => {
    let { success, message: msg } = await actUpdate({
      id: id,
      done: !val,
    });
    if (success) {
      message.success("更新成功！");
      search();
    } else {
      message.error(msg);
    }
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

  const gotoDealDetail = (id) => {
    navigate({
      pathname: "/pipeline",
      search: `?pipelineId=${id}`,
    });
  };

  const gotoCusDetail = ({ id, name }) => {
    navigate(`/analyseCustom/${id}`, { state: { name } });
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

    contractPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,

      data: {
        type,
        timeBy,
        userIdList,
        filterBy: 4,
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

  const gotoLinkPeople = (record) => {
    navigate({
      pathname: "/msgCoopratePeople",
      search: `?linkId=${record.id}&linkName=${record.name}`,
    });
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    // if filters not changed, don't update pagination.current

    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };
  //

  return (
    <>
      {open && (
        <Modal
          title={label}
          open={open}
          onOk={() => getRowSelected(false)}
          onCancel={() => getRowSelected(false)}
          width={1200}
          destroyOnClose
          bodyStyle={{
            padding: "8px",
          }}
          style={{
            top: "0px",
          }}
          footer={null}
        >
          <div>
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
              title={() => (
                <div style={{ textAlign: "right", fontSize: "12px" }}>
                  共{pageMsg.pagination.total}项数据
                </div>
              )}
              onHeaderCell={() => "onHeaderCell"}
            />
          </div>
        </Modal>
      )}
    </>
  );
}

export default TaskView;
