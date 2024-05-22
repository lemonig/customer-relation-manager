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
} from "antd";
import { actPage, actDelete, actExport, actUpdate } from "@Api/act_adm.js";
import { activityOverview } from "@Api/analyse_staff";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { activityPage } from "@Api/dashboard.js";
import IconFont from "@Components/IconFont";
import BtnAuth from "@Shared/BtnAuth";
const { RangePicker } = DatePicker;

function TaskView({ open, getRowSelected, params: { type, label } }) {
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
      title: "任务类型",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      sorter: true,
    },
    {
      title: "商机名称",
      key: "dealName",
      dataIndex: "dealName",
    },

    {
      title: "客户",
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: "费用",
      dataIndex: "fee",
      key: "fee",
    },
    {
      title: "状态",
      dataIndex: "statusName",
      key: "status",
      // filters: [
      //   {
      //     text: "代办",
      //     value: "1",
      //   },
      //   {
      //     text: "已完成",
      //     value: "2",
      //   },
      // ],
    },

    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
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

    activityPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,

      data: {
        type,
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
