import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Form,
  Tooltip,
  PageHeader,
  Statistic,
  Tabs,
} from "antd";
import { contractPage } from "@Api/contract.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import img2 from "../../../assets/image/2.png";
import img3 from "../../../assets/image/5.png";
import img4 from "../../../assets/image/6.png";
import Salers from "./components/Salers";
import Summary from "./components/Summary";
const { Option } = Select;

function MsgCooprate() {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: `销售人员维度`,
      children: <Salers></Salers>,
    },
    // {
    //   key: "2",
    //   label: `客户维度`,
    //   children: <img src={img2} alt="" />,
    // },
    // {
    //   key: "3",
    //   label: `合同维度`,
    //   children: <img src={img3} alt="" />,
    // },
    {
      key: "4",
      label: `报销费用明细`,
      children: <Summary />,
    },
  ];

  return (
    <div>
      <PageHeader className="site-page-header" title="费用控制" />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

      {/* 弹出表单 */}
    </div>
  );
}

export default MsgCooprate;
