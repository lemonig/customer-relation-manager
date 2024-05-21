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
  Statistic,
  TreeSelect,
} from "antd";
import { actPage, actDelete, actExport, actUpdate } from "@Api/act_adm.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ActForm from "./Form/ActForm";
import moment from "moment";
import { activeList } from "@Api/set_active.js";
import { salesmanList } from "@Api/set_user";
import { deptList as deptListApi } from "@Api/set_dept.js";
import IconFont from "@Components/IconFont";
import "./index.less";
import BtnAuth from "@Shared/BtnAuth";
import { arrayToTree } from "@Utils/util";
import { useParams } from "react-router-dom";
import DrawerTask from "@Shared/DrawerTask";
import DrawerDeal from "@Shared/DrawerDeal";
import DrawerLinkman from "@Shared/DrawerLinkman";
import DrawerCustomer from "@Shared/DrawerCustomer";
import StaffTree from "@Shared/StaffTree";
import { EyeOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;

function WorkPlan() {
  const [loading, setLoading] = useState(false);
  const [treeVis, setTreeVis] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //表格选中key
  const [selectedTable, setSelecteTable] = useState([]); //表格选中staff
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [odata, setOdata] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [salerList, setSalerList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [searchForm] = Form.useForm();
  const [drawerVis, setDrawerVis] = useState({
    task: false,
    deal: false,
    linkman: false,
    customer: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);
  const [userId, setUserId] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    getActiveData();
  }, []);
  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);
  useEffect(() => {
    getPageData();
  }, [userId]);
  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };
  //部门
  const getDeptList = async () => {
    let { data } = await deptListApi();
    let res = arrayToTree(data);
    setDeptList(res);
  };

  const getActiveData = async () => {
    setLoading(true);
    let { data } = await activeList();

    setActiveData(data);
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
  const showPeopleTree = () => {
    setTreeVis(true);
  };

  const getRowSelected = (flag, val) => {
    setTreeVis(false);
    if (flag) {
      setUserId(val);
    }
  };
  const columns = [
    {
      title: "创建人",
      dataIndex: "createUserName",
      key: "createUserName",
      fixed: "left",
      width: 80,
    },
    {
      title: "任务类型",
      dataIndex: "typeName",
      key: "typeName",
      fixed: "left",
      render: (val, { id }) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setOperateId(id);
              setOperateTxt(val);
              setDrawerVis({
                ...drawerVis,
                task: true,
              });
            }}
          >
            {val}
          </Button>
        );
      },
    },
    {
      title: "任务状态",
      dataIndex: "statusName",
      key: "status",
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
      render: (val, { dealId }) => {
        return (
          <a
            onClick={() => {
              setOperateId(dealId);
              setOperateTxt(val);
              setDrawerVis({
                ...drawerVis,
                deal: true,
              });
            }}
          >
            {val}
          </a>
        );
      },
    },
    {
      title: "关联客户",
      dataIndex: "orgName",
      key: "orgName",
      render: (val, { orgId }) => {
        return (
          <a
            onClick={() => {
              setOperateId(orgId);
              setOperateTxt(val);
              setDrawerVis({
                ...drawerVis,
                customer: true,
              });
            }}
          >
            {val}
          </a>
        );
      },
    },

    {
      title: "联系人",
      dataIndex: "personName",
      key: "personName",
      render: (val, { personId }) => {
        return (
          <a
            onClick={() => {
              setOperateId(personId);
              setOperateTxt(val);
              setDrawerVis({
                ...drawerVis,
                linkman: true,
              });
            }}
          >
            {val}
          </a>
        );
      },
    },

    {
      title: "实际费用",
      dataIndex: "fee",
      key: "fee",
      sorter: true,
    },
    // {
    //   title: "任务主题",
    //   dataIndex: "subject",
    //   key: "subject",
    // },

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

    // {
    //   title: "操作",
    //   key: "operation",
    //   fixed: "right",
    //   render: (_, record) => (
    //     <Space>
    //       <a onClick={() => handleEdit(record)}>编辑</a>
    //     </Space>
    //   ),
    // },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  // 新建
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  // 编辑
  const handleEdit = () => {
    setIsModalOpen(true);
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
      values.beginTime = moment(values.time[0]).format("YYYYMMDD");
      values.endTime = moment(values.time[1]).format("YYYYMMDD");
    }
    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    if (values.statusList) values.statusList = [values.statusList];
    if (values.typeIdList) values.typeIdList = [values.typeIdList];
    actPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      sort: pageMsg.order ? [`${pageMsg.field},${pageMsg.order}`] : undefined,
      data: {
        ...values,
        userIdList: userId,
        // typeIdList: pageMsg?.filters?.typeName,
        // statusList: pageMsg?.filters?.status,
      },
    }).then((res) => {
      setData(res.data);
      setOdata(res.additional_data.count);
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

  // 弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false);
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

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
  };
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
      <PageHeader className="site-page-header" title="任务" />
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={search}>
          {/* <Form.Item label="" name="name">
            <Input
              placeholder="请输入商机名称、任务编号、任务名称、客户公司"
              style={{ width: 300 }}
              // value={searchVal}
            />
          </Form.Item> */}

          {/* <Form.Item label="" name="deptIdList">
            <TreeSelect
              style={{ width: "180px" }}
              fieldNames={{
                label: "label",
                value: "key",
              }}
              treeData={deptList}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="选择部门"
              allowClear
              treeDefaultExpandAll
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
          </Form.Item> */}
          <Form.Item label="" name="typeIdList">
            <Select
              style={{ width: 200 }}
              options={activeData}
              placeholder="类型"
              allowClear
              fieldNames={{
                label: "name",
                value: "id",
              }}
            />
          </Form.Item>
          <Form.Item label="" name="statusList">
            <Select
              style={{ width: 200 }}
              allowClear
              options={[
                {
                  label: "待办",
                  value: "1",
                },
                {
                  label: "已完成",
                  value: "2",
                },
              ]}
              placeholder="状态"
            />
          </Form.Item>
          <Form.Item label="" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={download}>导出</Button>
              {selectedRowKeys.length === 0 ? (
                <BtnAuth word="activity:workplan:create">
                  <Button onClick={handleAdd}>新建</Button>
                </BtnAuth>
              ) : null}
              {selectedRowKeys.length > 0 ? (
                <Button onClick={handleDel}>删除</Button>
              ) : null}
              {selectedRowKeys.length === 1 ? (
                <Button onClick={handleEdit}>编辑</Button>
              ) : null}
              <Button
                type="text"
                onClick={showPeopleTree}
                icon={<EyeOutlined />}
              >
                按人员筛选
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <Table
        columns={columns}
        // rowSelection={rowSelection}
        dataSource={data}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          ...pageMsg.pagination,
        }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        scroll={{ x: columns.length * 150 }}
        title={() => (
          <div style={{ textAlign: "right", fontSize: "12px" }}>
            共{pageMsg.pagination.total}项数据，任务费用{" "}
            <Statistic
              title=""
              value={odata.totalFee}
              valueStyle={{ fontSize: "12px" }}
            />
            元
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
      {/* 弹出表单 */}
      {isModalOpen && (
        <ActForm
          isModalOpen={isModalOpen}
          record={selectedTable[0]}
          closeModal={closeModal}
        />
      )}
      {drawerVis.task && (
        <DrawerTask
          width="800"
          visible={drawerVis.task}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              task: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}

      {drawerVis.deal && (
        <DrawerDeal
          width="800"
          visible={drawerVis.deal}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              deal: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}
      {drawerVis.linkman && (
        <DrawerLinkman
          width="800"
          visible={drawerVis.linkman}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              linkman: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}
      {drawerVis.customer && (
        <DrawerCustomer
          width="800"
          visible={drawerVis.customer}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              customer: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}
      <StaffTree open={treeVis} getRowSelected={getRowSelected} />
    </div>
  );
}

export default WorkPlan;
