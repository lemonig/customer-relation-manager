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
} from "antd";
import {
  companyInfo,
  companyDelete,
  companyUpdate,
  companyAdd,
} from "@Api/info_company.js";
import { tianyancha } from "@Api/public.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { organize } from "@Utils/data";

const { Option } = Select;

function LinkCustomer({ open, getRowSelected, defaultId }) {
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
  }, [JSON.stringify(pageMsg)]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // 查询
  const search = () => {
    setPagemsg({
      ...pageMsg,
      pagination: {
        ...pageMsg.pagination,
        current: 1,
      },
    });

    // FIXME 分页信息异步了
    // getPageData();
  };
  const getPageData = () => {
    setLoading(true);
    companyInfo({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        name: searchVal,
        orgType: selectVal,
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

  const columns = [
    {
      title: "客户名称",
      width: 200,
      dataIndex: "name",
      key: "name",
    },
    {
      title: "机构类型",
      width: 100,
      dataIndex: "orgType",
      key: "orgType",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => {
        let res = organize.filter((ele) => ele.value == value);
        return res[0].label;
      },
    },

    {
      title: "统一社会信用代码",
      dataIndex: "creditCode",
      key: "creditCode",
      ellipsis: {
        showTitle: false,
      },
      render: (creditCode) => (
        <Tooltip placement="topLeft" title={creditCode}>
          {creditCode}
        </Tooltip>
      ),
      
    },
    {
      title: "备注",
      dataIndex: "description",
      key: "description",
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
      title: "创建用户",
      dataIndex: "createUserName",
      key: "createUserName",
      width: 100,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      ellipsis: {
        showTitle: false,
      },
      render: (createTime) => (
        <Tooltip placement="topLeft" title={createTime}>
          {createTime}
        </Tooltip>
      ),
    },
    // {
    //   title: "更新时间",
    //   dataIndex: "updateTime",
    //   key: "updateTime",
    // },
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
      console.log(selectedRows);
      console.log(selectedRowKeys);
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
      title="关联客户"
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
              placeholder="请输入客户名称"
              style={{ width: 240 }}
              // value={searchVal}
              onChange={handleInputChange}
            />
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
                console.log(event);
                console.log(record);
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

export default LinkCustomer;
