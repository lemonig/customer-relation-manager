import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  Badge,
} from "antd";
import { userList } from "@Api/set_user.js";

const { Option } = Select;

function CrmUser({ open, getRowSelected, defaultId, title }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operateId, setOperateId] = useState(null); //正在操作id
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchVal, setSearchVal] = useState("");
  const [selectVal, setSelectVal] = useState("1");
  const [data, setData] = useState([]);
  const [rowSelected, setRowSelected] = useState();
  const [rowKey, setRowKey] = useState([defaultId]);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  const showModal = () => {
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
  };
  const getPageData = async () => {
    setLoading(true);
    let res = await userList({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        name: searchVal,
      },
    });
    setData(res.data);
    setLoading(false);
    setPagemsg({
      ...pageMsg,
      pagination: {
        ...pageMsg.pagination,
        total: res.additional_data.pagination.total,
      },
    });
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
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "部门",
      dataIndex: "deptName",
      key: "deptName",
    },

    {
      title: "直接上级",
      dataIndex: "leaderName",
      key: "leaderName",
    },
    {
      title: "角色",
      dataIndex: "roleName",
      key: "roleName",
      ellipsis: {
        showTitle: false,
      },
      render: (roleName) => (
        <Tooltip placement="topLeft" title={roleName}>
          {roleName}
        </Tooltip>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchVal(value);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  const handleChange = (_, option) => {
    form.setFieldsValue({
      ...option,
      orgType: option.companyType,
    });
  };

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelected(selectedRows);
      setRowKey(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
    selectedRowKeys: rowKey,
    defaultSelectedRowKeys: [defaultId],
  };

  return (
    <Modal
      title={title ?? "直接上级"}
      open={open}
      onOk={() => getRowSelected(true, rowSelected)}
      onCancel={() => getRowSelected(false)}
      width={800}
      destroyOnClose
      bodyStyle={{
        padding: "8px",
      }}
      style={{
        top: "0px",
      }}
    >
      <div>
        <div className="search">
          <Space>
            <Input
              placeholder="请输入姓名"
              style={{ width: 240 }}
              // value={searchVal}
              onChange={handleInputChange}
            />
            <Button type="primary" onClick={search}>
              确定
            </Button>
          </Space>
        </div>
        <Table
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pageMsg.pagination}
          rowKey={(record) => record.id}
          onChange={handleTableChange}
          onRow={(record) => {
            return {
              onClick: (event) => {
                setRowSelected([record]);
                setRowKey([record.id]);
              }, // 点击行
            };
          }}
        />
      </div>
    </Modal>
  );
}

export default CrmUser;
