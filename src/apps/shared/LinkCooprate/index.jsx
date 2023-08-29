import React, { useState, useEffect } from "react";
import { Input, Space, Table, Modal, Form, Tooltip, Button } from "antd";
import {
  cooperateInfo,
  cooperateDelete,
  cooperateUpdate,
  cooperateAdd,
} from "@Api/info_cooperate.js";
import { organize } from "@Utils/data";
import FormCoop from "../../pages/msg-cooprate/components/FormCoop";

function LinkCooprate({ open, getRowSelected, defaultId }) {
  const [form] = Form.useForm();
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

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

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
    cooperateInfo({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        name: searchVal,
      },
    }).then((res) => {
      if (res.success) {
        setData(res.data);
        setPagemsg({
          ...pageMsg,
          pagination: {
            ...pageMsg.pagination,
            total: res.additional_data.pagination.total,
          },
        });
        // 默认第一条
        setRowSelected([res.data[0]]);
        if (!defaultId) {
          setRowKey([res.data[0].id]);
        }
      }
      setLoading(false);
    });
  };

  const columns = [
    {
      title: "公司名称",
      width: 200,
      dataIndex: "name",
      key: "name",
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

      setRowKey(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
    selectedRowKeys: rowKey,
    defaultSelectedRowKeys: [defaultId],
  };
  // 新建
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
  };
  return (
    <>
      {open && (
        <Modal
          title="关联公司"
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
                  placeholder="请输入公司名称"
                  style={{ width: 240 }}
                  // value={searchVal}
                  onChange={handleInputChange}
                />
                <Button type="primary" onClick={search}>
                  查询
                </Button>
                <Button onClick={handleAdd}>新建</Button>
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
      )}
      {/* 弹出表单 */}
      {isModalOpen && <FormCoop open={isModalOpen} closeModal={closeModal} />}
    </>
  );
}

export default LinkCooprate;
