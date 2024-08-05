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
import { activeList } from "@Api/set_active.js";
import IconFont from "@Components/IconFont";
import BtnAuth from "@Shared/BtnAuth";
const { RangePicker } = DatePicker;

function TaskView({
  clickCallback,
  clickCallback1,
  clickCallback2,
  clickCallback3,
}) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //表格选中key
  const [selectedTable, setSelecteTable] = useState([]); //表格选中staff
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [searchForm] = Form.useForm();
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
    pageMsg?.order,
    pageMsg?.field,
  ]);

  const getActiveData = async () => {
    setLoading(true);
    let { data } = await activeList();
    let list = data.map((item) => ({
      text: item.name,
      value: item.id,
    }));
    setActiveData(list);
  };
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
    // {
    //   title: "完成",
    //   dataIndex: "done",
    //   key: "done",
    //   render: (down, record) =>
    //     down ? (
    //       <IconFont
    //         iconName="wancheng"
    //         color="#DEDEDE"
    //         style={{ cursor: "pointer" }}
    //         size={18}
    //         onClick={() => handleChangeOver(record.id, down)}
    //       />
    //     ) : (
    //       <IconFont
    //         iconName="weikao"
    //         color="#DEDEDE"
    //         style={{ cursor: "pointer" }}
    //         size={16}
    //         onClick={() => handleChangeOver(record.id, down)}
    //       />
    //     ),
    // },
    {
      title: "任务类型",
      dataIndex: "typeName",
      key: "typeName",
      fixed: "left",
      render: (value, rec) => <Button type="link">{value}</Button>,
      onCell: (record) => ({
        onClick: (event) => {
          clickCallback3(record.typeName, record.id);
        },
      }),
    },
    {
      title: "任务状态",
      dataIndex: "statusName",
      key: "status",
      fixed: "left",
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
      title: "标题",
      dataIndex: "subject",
      key: "subject",
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
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      sorter: true,
    },
    {
      title: "完成时间",
      dataIndex: "doneTime",
      key: "doneTime",
    },

    {
      title: "关联商机",
      key: "dealName",
      dataIndex: "dealName",
      // render: (row) => row.deal.name,
      render: (value, record) => (
        <Space>
          <a>{value}</a>
        </Space>
      ),
      onCell: (record) => ({
        onClick: (event) => {
          clickCallback(record.dealName, record.dealId);
        },
      }),
    },
    {
      title: "关联客户",
      dataIndex: "orgName",
      key: "orgName",
      width: 300,
      render: (value, record) => (
        <Space>
          <a>{value}</a>
        </Space>
      ),
      onCell: (record) => ({
        onClick: (event) => {
          clickCallback1(record.orgName, record.orgId);
        },
      }),
    },
    {
      title: "联系人",
      dataIndex: "personName",
      key: "personName",
      render: (value, record) => (
        <Space>
          <a>{value}</a>
        </Space>
      ),
      onCell: (record) => ({
        onClick: (event) => {
          clickCallback2(record.personName, record.personId);
        },
      }),
    },
    {
      title: "实际费用",
      dataIndex: "fee",
      key: "fee",
      sorter: true,
    },

    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "OA推送状态",
      dataIndex: "isSync",
      key: "isSync",
      render: (val) => (val ? "已同步" : "未同步"),
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
    setSelectedRowKeys([]);
    setSelecteTable([]);
  };
  const getPageData = () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYYMM");
      values.endTime = moment(values.time[1]).format("YYYYMM");
    }
    activityOverview({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      sort: pageMsg.order ? [`${pageMsg.field},${pageMsg.order}`] : undefined,
      data: {
        ...values,
        typeIdList: pageMsg?.filters?.typeName,
        statusList: pageMsg?.filters?.status,
        userId: id,
        showFee: showFee,
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

  // 删除
  const handleDel = () => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "是否删除?",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await actDelete({
          idList: selectedRowKeys,
        });
        if (success) {
          resetTable();
        }
        message.success(msg);
      },
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

  // 表格转态初始化
  const resetTable = () => {
    setSelectedRowKeys([]);
    setSelecteTable([]);
    getPageData();
  };
  // 表格选中
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelecteTable(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onSwitchChange = (checked) => {
    setShowFee(checked);
  };

  useEffect(() => {
    getPageData();
  }, [showFee]);

  //导出
  const download = () => {
    actExport(
      {
        idList: selectedRowKeys,
      },
      "任务导出"
    );
  };

  return (
    <div>
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="time">
            <RangePicker picker="month" />
          </Form.Item>
          <Form.Item label="" name="name">
            <Input
              placeholder="请输入任务编号"
              style={{ width: 180 }}
              // value={searchVal}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <Space>
          <span>只看实际费用大于0</span>
          <Switch
            checked={showFee}
            onChange={onSwitchChange}
            loading={loading}
          ></Switch>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{
          x: (columns.length - 1) * 150,
        }}
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
        rowClassName={(record, index) => {
          if (record.status == 1) {
          } else if (record.status == 3) {
            return "red";
          } else if (record.status == 2) {
            return "gray";
          } else {
          }
        }}
      />
    </div>
  );
}

export default TaskView;
