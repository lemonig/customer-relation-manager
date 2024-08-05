/*
 * @Author: Jonny
 * @Date: 2024-05-15 16:42:13
 * @LastEditors: Jonny
 * @LastEditTime: 2024-08-05 11:35:07
 * @FilePath: \grean-crm\src\apps\shared\StaffTree\index.jsx
 */
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
  List,
  Typography,
} from "antd";
import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";

import { userList, personList, userListTree } from "@Api/set_user.js";
import { deptList, userDeptList } from "@Api/set_dept.js";
import { arrayToTree } from "@Utils/util";
import IconFont from "@Components/IconFont";
import { useDispatch, useSelector } from "react-redux";
import { SAVE_ID, DELETE_ID } from "@Store/features/staffTreeSlice";
const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];
function Index({ open, getRowSelected, defaultId, url, author = true }) {
  let dispatch = useDispatch();
  const { userIdList } = useSelector((state) => state.staffTreeSlice);
  const [form] = Form.useForm();
  const [deptData, setDeptData] = useState([]); //部门
  const [treeData, setTreeData] = useState([]); //部门树
  const [selectTreeId, setSelectTreeId] = useState([]); //选中的树key
  const [selectTree, setSelectTree] = useState({}); //选中的树 node
  const [selectedStaff, setSelectedStaff] = useState([]); //选中staff
  const [selectedDept, setSelectedDept] = useState([]); //选中dept
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 1000,
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
    let { data } = await userListTree();
    // let temp = data.find(({ id }) => id == 1);
    // let res = arrayToTree(data);
    // res[0].icon = <IconFont iconName="gongsi1" size="18" />; //加icon
    setTreeData(data);
    // setDeptData(data);
    // setSelectTreeId([temp.id]);
    // setSelectTree(temp);
  };
  // useEffect(() => {
  //   if (selectTreeId.length > 0) getUserData();
  // }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  // useEffect(() => {
  //   if (selectTreeId.length > 0) search();
  // }, [JSON.stringify(selectTreeId)]);

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
  const getUserData = async () => {
    setLoading(true);
    let response = void 0;
    let params = {
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        deptId: selectTreeId[0],
      },
    };
    author
      ? (response = await personList(params))
      : (response = await userList(params));
    let { data, additional_data } = response;
    setData(data);
    setLoading(false);
    setPagemsg({
      ...pageMsg,
      pagination: {
        ...pageMsg.pagination,
        total: additional_data.pagination.total,
      },
    });
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  //选择/取消
  const toggleItemInArray = (array, item, key) => {
    const index = array.findIndex((value, index, arr) => {
      return value[key] == item[key];
    });
    if (index !== -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
    return array;
  };
  // 点击树
  const onTreeSelect = (selectedKeys, info) => {
    if (info.selected && info.node.id !== selectTreeId[0]) {
      // dispatch(SAVE_ID(selectedKeys));
      // setSelectTreeId(selectedKeys);
      // setSelectTree(info.node);
      let newStaff = toggleItemInArray(selectedStaff, info.node, "key");
      setSelectedStaff([...newStaff]);
    }
  };
  const onTreeClick = (selectedKeys, info) => {
    let newDept = toggleItemInArray(selectedDept, info, "key");
    setSelectedDept([...newDept]);
  };

  const delStaff = (staff) => {
    let newStaff = toggleItemInArray(selectedStaff, staff, "key");
    setSelectedStaff([...newStaff]);
  };
  const delDept = (dept) => {
    let newDept = toggleItemInArray(selectedDept, dept, "key");
    setSelectedDept([...newDept]);
  };

  const columns = [
    {
      title: "姓名",
      key: "nickname",
      dataIndex: "nickname",
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

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    // if (flag) getPageData();
  };

  // 自定义节点渲染
  const titleRender = (nodeData) => {
    let treeNode = nodeData.isUser ? (
      <span>
        <IconFont iconName="ren" size={18}></IconFont> {nodeData.label}
      </span>
    ) : (
      <span onClick={() => onTreeClick(nodeData.key, nodeData)}>
        <IconFont iconName="gongsi" size={18}></IconFont> {nodeData.label}
      </span>
    );
    return treeNode;
  };

  //遍历树找到子节点
  const findLastNOde = (tree) => {
    const value = [];
    const traverse = (currentNode) => {
      if (!currentNode) return;
      if (currentNode.children.length == 0) {
        value.push(currentNode.userId);
      } else {
        currentNode.children.forEach((ele) => traverse(ele));
      }
    };
    traverse(tree);
    return value;
  };

  const findoutKey = (arr) => {
    return arr.map((ele) => ele.userId);
  };
  //确认
  const confirm = () => {
    const temp = selectedDept.map((ele) => {
      return findLastNOde(ele);
    });
    const userIds = [...new Set(temp.flat())];
    const userIds1 = findoutKey(selectedStaff);
    const res = [...new Set([...userIds, ...userIds1])];
    getRowSelected(true, res);
  };

  return (
    <>
      {open && (
        <Modal
          title="选择员工"
          open={open}
          onOk={confirm}
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
                  height: "550px",
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
                      // defaultExpandedKeys={[0, 1, 2]}
                      // defaultSelectedKeys={[0]}
                      switcherIcon={<CaretDownOutlined />}
                      onSelect={onTreeSelect}
                      treeData={treeData}
                      selectedKeys={selectTreeId}
                      showIcon
                      // rootClassName="tree-root"
                      titleRender={titleRender}
                      fieldNames={{ title: "label", key: "id" }}
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
                <List
                  header={"已选择的成员"}
                  dataSource={selectedStaff}
                  size="small"
                  renderItem={(item) => (
                    <>
                      <List.Item onClick={() => delStaff(item)}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Space>
                            <IconFont iconName="ren" size={18}></IconFont>
                            {item.label}
                          </Space>
                          <CloseOutlined />
                        </div>
                      </List.Item>
                    </>
                  )}
                />

                <List
                  header={"已选择的部门"}
                  dataSource={selectedDept}
                  size="small"
                  renderItem={(item) => (
                    <>
                      <List.Item onClick={() => delDept(item)}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Space>
                            <IconFont iconName="gongsi" size={18}></IconFont>
                            {item.label}
                          </Space>
                          <CloseOutlined />
                        </div>
                      </List.Item>
                    </>
                  )}
                />

                {/* <Table
                  columns={columns}
                  loading={loading}
                  rowKey={(record) => record.id}
                  bordered
                  rowSelection={rowSelection}
                  dataSource={data}
                  pagination={false}
                  onChange={handleTableChange}
                  scroll={{ y: 500 }}
                /> */}
              </Content>
            </Layout>
            {/* <div>已选：{selectedRowKeys.length}人</div> */}
          </div>
        </Modal>
      )}
    </>
  );
}

export default Index;
