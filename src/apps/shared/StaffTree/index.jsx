import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Form,
  Tree,
  Tag,
  Layout,
  Modal,
  Button,
  PageHeader,
  Badge,
  message,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";

import { userList } from "@Api/set_user.js";
import { deptList } from "@Api/set_dept.js";
import { arrayToTree } from "@Utils/util";
import IconFont from "@Components/IconFont";
import { useDispatch, useSelector } from "react-redux";
import { SAVE_ID, DELETE_ID } from "@Store/features/staffTreeSlice";

function Index({ open, getRowSelected, defaultId, url }) {
  let dispatch = useDispatch();
  const { userIdList } = useSelector((state) => state.staffTreeSlice);
  const [form] = Form.useForm();
  const [deptData, setDeptData] = useState([]); //部门
  const [treeData, setTreeData] = useState([]); //部门树
  const [selectTreeId, setSelectTreeId] = useState([]); //选中的树key
  const [selectTree, setSelectTree] = useState({}); //选中的树 node
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //表格选中key
  const [selectedStaff, setSelectedStaff] = useState([]); //表格选中staff
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchVal, setSearchVal] = useState("");
  const [data, setData] = useState([]);
  const [rowSelected, setRowSelected] = useState([]);
  const [rowKey, setRowKey] = useState([]);
  // 新增
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { Header, Footer, Sider, Content } = Layout;

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
    if (selectTreeId.length > 0) getUserData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  useEffect(() => {
    if (selectTreeId.length > 0) search();
  }, [JSON.stringify(selectTreeId)]);

  // 查询
  const search = () => {
    if (pageMsg.pagination.current === 1) {
      getUserData();
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
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  // 点击部门树
  const onTreeSelect = (selectedKeys, info) => {
    if (info.selected && info.node.id !== selectTreeId[0]) {
      dispatch(SAVE_ID(selectedKeys));
      setSelectTreeId(selectedKeys);
      setSelectTree(info.node);
    }
  };
  const columns = [
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
  ];

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

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchVal(value);
  };

  const handleChange = (_, option) => {
    form.setFieldsValue({
      ...option,
      orgType: option.companyType,
    });
  };

  const rowSelection = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: onSelectChange,
  };
  // 新建
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    // if (flag) getPageData();
  };

  return (
    <>
      {open && (
        <Modal
          title="选择员工"
          open={open}
          onOk={() => getRowSelected(true, selectedRowKeys)}
          onCancel={() => getRowSelected(false)}
          width={600}
          destroyOnClose
          bodyStyle={{
            padding: "8px",
          }}
        >
          <div style={{ height: "100%" }}>
            <Layout className="staff">
              <Sider
                style={{
                  background: "#fff",
                  height: "600px",
                  overflow: "auto",
                }}
                width="240"
              >
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
            <div>已选：{selectedRowKeys.length}人</div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Index;
