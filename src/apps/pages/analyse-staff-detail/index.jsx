import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Space,
  Table,
  PageHeader,
  DatePicker,
  Col,
  Row,
  Form,
  Select,
  Checkbox,
  Tooltip,
  Statistic,
  Tabs,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Head from "./components/Head";
import OverView from "./components/OverView";

function DealList() {
  const { id } = useParams();

  const items = [
    {
      key: "1",
      label: "总览",
      children: <OverView></OverView>,
    },
    {
      key: "2",
      label: "商机",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "任务",
      children: "Content of Tab Pane 3",
    },
  ];

  console.log(id);
  return (
    <div className="detail-page">
      <Head></Head>
      <div className="search" style={{ marginBottom: "0px" }}></div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        destroyInactiveTabPane
        centered={true}
      />
    </div>
  );
}

export default DealList;

function tableRender(value) {
  return <>{<span>{value.value}</span>}</>;
}
