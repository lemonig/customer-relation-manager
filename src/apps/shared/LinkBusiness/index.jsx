import React, { useState, useEffect } from "react";
import { Input, Select, Space, Table, Modal, Form, Tooltip } from "antd";
import { dealPage } from "@Api/deal.js";
import { organize } from "@Utils/data";

function LinkBusiness({ open, getRowSelected, defaultId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
    dealPage({
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
      title: "商机编号",
      dataIndex: "code",
      key: "code",
      ellipsis: {
        showTitle: false,
      },
      render: (code) => (
        <Tooltip placement="topLeft" title={code}>
          {code}
        </Tooltip>
      ),
    },
    {
      title: "商机名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "预计金额",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "客户公司",
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
      title: "客户联系人",
      dataIndex: "personName",
      key: "personName",
      ellipsis: {
        showTitle: false,
      },
      render: (personName) => (
        <Tooltip placement="topLeft" title={personName}>
          {personName}
        </Tooltip>
      ),
    },
    {
      title: "商机状态",
      dataIndex: "statusName",
      key: "statusName",
    },
    {
      title: "销售人员",
      dataIndex: "pipelineName",
      key: "pipelineName",
      ellipsis: {
        showTitle: false,
      },
      render: (pipelineName) => (
        <Tooltip placement="topLeft" title={pipelineName}>
          {pipelineName}
        </Tooltip>
      ),
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
    {
      title: "创建用户",
      dataIndex: "createUserName",
      key: "createUserName",
      width: 100,
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
      title="关联商机"
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
              placeholder="请输入商机名称、商机编码、客户公司"
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

export default LinkBusiness;
