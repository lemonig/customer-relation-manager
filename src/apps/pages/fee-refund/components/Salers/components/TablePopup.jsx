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
  PageHeader,
  Statistic,
} from "antd";
import { feeList, feeListExport } from "@Api/fee-refund";
import moment from "moment";

function TablePopup({ isModalOpen, closeModal, operate }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = () => {
    setLoading(true);
    let values = JSON.parse(JSON.stringify(operate));

    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    feeList({
      page: 1,
      size: 10000,
      data: {
        ...values,
      },
    }).then((res) => {
      let newData = res.data.map((item, idx) => ({
        ...item,
        index: idx + 1,
      }));
      setData(newData);
      setLoading(false);
    });
  };

  const columns = [
    {
      title: "序号",
      key: "index",
      dataIndex: "index",
      width: 60,
      // render: (_, record, index) => index + 1,
    },
    {
      title: "费用报销单号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "报销类型",
      dataIndex: "expenseTypeName",
      key: "expenseTypeName",
    },
    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "项目编码",
      dataIndex: "projectCode",
      key: "projectCode",
    },
    {
      title: "商机编号",
      dataIndex: "dealCode",
      key: "dealCode",
    },
    {
      title: "商机名称",
      dataIndex: "dealName",
      key: "dealName",
    },
    // {
    //   title: "合同名称",
    //   dataIndex: "projectName",
    //   key: "projectName",
    // },
    {
      title: "客户公司",
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: "费用类型",
      dataIndex: "feeTypeName",
      key: "feeTypeName",
    },

    // {
    //   title: "开始时间",
    //   dataIndex: "startTime",
    //   key: "startTime",
    // },
    // {
    //   title: "结束时间",
    //   dataIndex: "endTime",
    //   key: "endTime",
    // },
    {
      title: "报销金额",
      dataIndex: "feeValue",
      key: "feeValue",
      render: (feeValue, record) => (
        <Statistic value={feeValue} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];

  return (
    <Modal
      title="费用报销明细"
      open={isModalOpen}
      onOk={() => closeModal()}
      onCancel={() => closeModal()}
      maskClosable={false}
      destroyOnClose
      width={1200}
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id}
      />
    </Modal>
  );
}

export default TablePopup;
