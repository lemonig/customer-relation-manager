import React, { useState, useEffect } from "react";
import {
  Tree,
  Table,
  Tag,
  Layout,
  Modal,
  Button,
  PageHeader,
  Dropdown,
  Menu,
  Badge,
  message,
  Space,
} from "antd";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  CaretDownOutlined,
  StopOutlined,
  TrademarkOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import IconFont from "@Components/IconFont";
import DeparmentForm from "./Form/DeparmentForm";
import UserForm from "./Form/UserForm";
import {
  userList,
  userUpdate,
  userDelete,
  userAdd,
  userEnable,
  userSearch,
  userDisable,
} from "@Api/set_user.js";
import { deptDelete, deptAdd, deptList, deptUpdate } from "@Api/set_dept.js";
import { arrayToTree } from "@Utils/util";

import "./index.less";

const { Header, Footer, Sider, Content } = Layout;
const { DirectoryTree } = Tree;

const columns = [
  {
    title: "状态",
    key: "status",
    dataIndex: "status",
    width: 100,
    render: (status) => {
      return (
        <>
          {status == 1 ? (
            <Badge status="success" text="已激活" />
          ) : (
            <Badge status="error" text="禁用" />
          )}
        </>
      );
    },
  },
  {
    title: "姓名",
    key: "nickname",
    render: (row) => {
      return (
        <Space>
          {row.nickname}
          {row.isDeptOwner ? <Tag color="warning">负责人</Tag> : null}
        </Space>
      );
    },
  },

  {
    title: "手机号",
    dataIndex: "phone",
    key: "phone",
  },
  // {
  //   title: "性别",
  //   dataIndex: "sex",
  //   key: "sex",
  // },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "部门",
    dataIndex: "deptName",
    key: "deptName",
  },
  // {
  //   title: "岗位",
  //   dataIndex: "updateTime",
  //   key: "updateTime",
  // },
  {
    title: "直接上级",
    dataIndex: "leaderName",
    key: "leaderName",
  },
  {
    title: "角色",
    dataIndex: "roleName",
    key: "roleName",
  },
];

function Staff() {
  const [loading, setLoading] = useState(false);
  const [deptData, setDeptData] = useState([]); //部门
  const [treeData, setTreeData] = useState([]); //部门树
  const [selectTreeId, setSelectTreeId] = useState([]); //选中的树key
  const [selectTree, setSelectTree] = useState({}); //选中的树 node
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //表格选中key
  const [selectedStaff, setSelectedStaff] = useState([]); //表格选中staff
  const [isModalOpen, setIsModalOpen] = useState(false); //员工弹窗
  const [isModalOpen1, setIsModalOpen1] = useState(false); //部门弹窗
  const [deptOpeT, setDeptOpeT] = useState("add"); //部门编辑/新增
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  }); //分页
  const [data, setData] = useState([]);

  useEffect(() => {
    getDeptList();
  }, []);
  // 获取部门
  const getDeptList = async () => {
    let { data } = await deptList();
    data[0].icon = <IconFont iconName="gongsi1" size="18" />; //加icon
    let res = arrayToTree(data);

    setTreeData(res);
    setDeptData(data);
    setSelectTreeId([data[0].id]);
    setSelectTree(data[0]);
  };

  useEffect(() => {
    console.log("获取table");
    console.log(selectTreeId);
    if (selectTreeId.length > 0) getUserData();
    console.log(pageMsg);
  }, [JSON.stringify(pageMsg), JSON.stringify(selectTreeId)]);

  // 获取用户
  const getUserData = () => {
    setLoading(true);
    userList({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        deptId: selectTreeId[0],
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

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  // 点击部门树
  const onTreeSelect = (selectedKeys, info) => {
    console.log(info);
    // 因为树可取消，so 在选中&& 与上个选中的值不同时才刷新
    if (info.selected && info.node.id !== selectTreeId[0]) {
      setSelectTreeId(selectedKeys);
      setSelectTree(info.node);
      // 清楚表格选中
      setSelectedRowKeys([]);
      setSelectedStaff([]);
    }
  };
  // 编辑添加菜单 DOM
  const hanldeDepEdit = () => {
    setIsModalOpen1(true);
    setDeptOpeT("edit");
  };

  const hanldeDepAdd = () => {
    setIsModalOpen1(true);
    setDeptOpeT("add");
  };

  // 删除
  const handleDel = () => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法回复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await deptDelete({
          id: selectTreeId[0],
        });
        if (success) {
          message.success("提交成功");
          getDeptList();
        } else {
          message.error(msg);
        }
      },
    });
  };
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => hanldeDepEdit("edit")}
            >
              编辑部门
            </a>
          ),
        },
        selectTreeId == 1
          ? null
          : {
              key: "2",
              label: (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDel}
                >
                  删除部门
                </a>
              ),
            },
      ]}
    />
  );

  // 表格转态初始化
  const resetTable = () => {
    setSelectedRowKeys([]);
    setSelectedStaff([]);
    getUserData();
  };
  // 表格选中
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedStaff(selectedRows);
  };

  const closeDepartmentModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen1(false);
    if (flag) getDeptList();
  };
  const closeUserModal = (flag) => {
    setIsModalOpen(false);
    if (flag) {
      resetTable();
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // 编辑员工
  const editStaff = () => {
    setIsModalOpen(true);
  };

  // 禁用
  const disableStaff = () => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "这些员工账号将被禁用, 是否继续?",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await userDisable({
          idList: selectedRowKeys,
        });
        if (success) {
          resetTable();
          message.success(msg);
        } else {
          message.error(msg);
        }
      },
    });
  };
  // 激活 ,
  const activeStaff = () => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "这些员工账号将被激活, 是否继续?",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await userEnable({
          idList: selectedRowKeys,
        });
        if (success) {
          resetTable();
          message.success(msg);
        } else {
          message.error(msg);
        }
      },
    });
  };

  return (
    <>
      <div style={{ height: "100%" }}>
        <PageHeader
          className="site-page-header"
          title="用户管理"
          extra={[
            selectedRowKeys.length == 0 ? (
              <Button
                key="1"
                type="primary"
                onClick={() => setIsModalOpen(true)}
              >
                添加员工
              </Button>
            ) : null,
          ]}
        />

        <Layout className="staff">
          <Sider style={{ background: "#fff", height: "100%" }} width="240">
            <div className="tree-wrap">
              <div className="tree-menu">
                <span>企业组织架构</span>{" "}
                {/* <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={() => hanldeDepAdd("add")}
                >
                  新建部门
                </Button> */}
              </div>
              {treeData.length > 0 && (
                <Tree
                  blockNode
                  defaultExpandAll={true}
                  // defaultExpandedKeys={[0, 1, 2]}
                  // defaultSelectedKeys={[0]}
                  switcherIcon={<CaretDownOutlined />}
                  onSelect={onTreeSelect}
                  treeData={treeData}
                  selectedKeys={selectTreeId}
                  showIcon
                  // rootClassName="tree-root"
                  fieldNames={{ title: "name", key: "id" }}
                />
              )}
            </div>
          </Sider>
          <Content
            style={{
              paddingLeft: "50px",
              background: "#fff",
            }}
          >
            <div className="table-title">
              {selectedRowKeys.length > 0 ? (
                <>
                  {/* 选中 */}
                  <div className="text">
                    <span className="title">
                      {" "}
                      已选中<span className="value">1</span>项
                    </span>
                    <span className="desc">
                      <Button
                        type="text"
                        icon={<StopOutlined />}
                        onClick={disableStaff}
                      >
                        禁用
                      </Button>
                      <Button
                        type="text"
                        icon={<TrademarkOutlined />}
                        onClick={activeStaff}
                      >
                        激活
                      </Button>
                      {/* 选中一条才能编辑 */}
                      {selectedRowKeys.length > 1 ? null : (
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={editStaff}
                        >
                          编辑
                        </Button>
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* 未选中 */}
                  <div className="text">
                    <span className="title"> {selectTree?.name}</span>
                    <span className="desc">
                      所有员工
                      <span className="value">{pageMsg.pagination.total}</span>
                      人{/* 停用 <span className="value">1</span>人 */}
                    </span>
                  </div>
                  <div className="tool">
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={() => hanldeDepAdd("add")}
                    >
                      新建部门
                    </Button>
                    <Dropdown trigger={["click"]} overlay={menu}>
                      <Button icon={<EllipsisOutlined />} size="big"></Button>
                    </Dropdown>
                  </div>
                </>
              )}
            </div>

            <Table
              columns={columns}
              loading={loading}
              rowKey={(record) => record.id}
              bordered
              rowSelection={rowSelection}
              dataSource={data}
              pagination={pageMsg.pagination}
              onChange={handleTableChange}
            />
          </Content>
        </Layout>
      </div>
      {/* 部门弹窗 */}
      {isModalOpen1 && (
        <DeparmentForm
          isModalOpen={isModalOpen1}
          closeModal={closeDepartmentModal}
          deptData={deptData}
          data={selectTree}
          operate={deptOpeT}
        />
      )}

      {/* 员工弹窗 */}
      {isModalOpen && (
        <UserForm
          isModalOpen={isModalOpen}
          closeModal={closeUserModal}
          treeData={treeData}
          userData={selectedStaff[0]}
        />
      )}
    </>
  );
}

export default Staff;
