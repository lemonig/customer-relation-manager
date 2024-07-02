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
import DealView from "./components/DealView";
import TaskView from "./components/TaskView";
import ContractView from "./components/ContractView";
import FeeView from "./components/FeeView";
import DrawerDeal from "@Shared/DrawerDeal";
import DrawerLinkman from "@Shared/DrawerLinkman";
import DrawerCustomer from "@Shared/DrawerCustomer";
import DrawerTask from "@Shared/DrawerTask";

function DealList() {
  const { id } = useParams();
  const [drawerVis, setDrawerVis] = useState({
    deal: false,
    customer: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);
  const clickCallback = (txt, id) => {
    setOperateId(id);
    setOperateTxt(txt);
    setDrawerVis({
      ...drawerVis,
      deal: true,
    });
  };
  const clickCallback1 = (txt, id) => {
    setOperateId(id);
    setOperateTxt(txt);
    setDrawerVis({
      ...drawerVis,
      customer: true,
    });
  };

  const items = [
    {
      key: "1",
      label: "总览",
      children: <OverView></OverView>,
    },
    {
      key: "2",
      label: "商机",
      children: <DealView clickCallback={clickCallback} />,
    },
    {
      key: "3",
      label: "任务",
      children: (
        <TaskView
          clickCallback={clickCallback}
          clickCallback1={clickCallback1}
        />
      ),
    },
    {
      key: "4",
      label: "合同",
      children: <ContractView></ContractView>,
    },
    {
      key: "5",
      label: "费用",
      children: <FeeView></FeeView>,
    },
  ];

  return (
    <>
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
      {drawerVis.customer && (
        <DrawerCustomer
          width="1000"
          visible={drawerVis.customer}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              customer: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}

      {drawerVis.deal && (
        <DrawerDeal
          width="1000"
          visible={drawerVis.deal}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              deal: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}
    </>
  );
}

export default DealList;

function tableRender(value) {
  return <>{<span>{value.value}</span>}</>;
}
