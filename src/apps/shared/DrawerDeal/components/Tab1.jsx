import React, { useState, useEffect, useContext } from "react";
import { actGet } from "@Api/act_adm";
import {
  Card,
  Button,
  Menu,
  Divider,
  Statistic,
  Form,
  Modal,
  Descriptions,
  Progress,
  PageHeader,
  Space,
  message,
  Tag,
} from "antd";
import { DealContext } from "../index";
import { dealSingleGet, dealwin, dealReopen } from "@Api/deal_list";
import Stage from "@Pages/deal-detail/components/Stage";
import TimeLine from "./TimeLine";
import FormTrans from "@Pages/deal-detail/components/Form/FormTrans";

const Tab1 = () => {
  const id = useContext(DealContext);
  const [data, setData] = useState();
  const [modalVis, setModalVis] = useState({
    lose: false,
    stop: false,
    trans: false,
    logs: false,
  });

  useEffect(() => {
    getPageData();
  }, []);
  const getPageData = async () => {
    let { data } = await dealSingleGet({
      id: id,
    });
    setData(data);
  };
  // 活得丢单赢单时间
  const getDealStatus = ({
    status,
    lostTime,
    terminationTime,
    wonTime,
    statusName,
  }) => {
    if (!status || status == 1 || status == 5) {
      return null;
    }
    let label = "",
      time = "";
    if (status == 2) {
      label = "赢单";
      time = wonTime;
    } else if (status == 3) {
      label = "";
      time = lostTime;
    } else if (status == 4) {
      label = "";
      time = terminationTime;
    }
    return (
      <Descriptions.Item label={statusName + "时间"}>{time}</Descriptions.Item>
    );
  };

  const closeModal = (flag, page) => {
    // flag 确定还是取消
    setModalVis({
      lose: false,
      stop: false,
      trans: false,
    });
    if (flag) {
      getPageData();
    }
  };
  const $cteateTitle = () => {
    return (
      <div className="search" style={{ marginBottom: "0px" }}>
        <div>基本信息</div>
        <Button
          type="link"
          onClick={() => {
            setModalVis({
              ...modalVis,
              trans: true,
            });
          }}
        >
          转移
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="main-block">
        <div className="sidebar">
          {data && (
            <Card
              // title="客户公司"
              bordered={false}
              className="l-card card-margin"
              headStyle={{
                fontSize: "12px",
                color: "#721ea9",
                fontWeight: 600,
              }}
            >
              {/* 基本信息 */}
              <Descriptions title={$cteateTitle()} column={2}>
                <Descriptions.Item label="商机名称">
                  {data.title}
                </Descriptions.Item>

                <Descriptions.Item label="预算金额（元）">
                  <Statistic
                    value={data.value}
                    valueStyle={{ fontSize: "12px" }}
                  />
                </Descriptions.Item>

                <Descriptions.Item label="客户名称">
                  {data.orgName}
                </Descriptions.Item>
                <Descriptions.Item label="最终用户">
                  {data.isFinalOrg ? "是" : "否"}
                </Descriptions.Item>
                <Descriptions.Item label="备注" span={2}>
                  {data.description}
                </Descriptions.Item>
                <Descriptions.Item label="销售人员">
                  {data.ownerUserName}
                </Descriptions.Item>

                <Descriptions.Item label="信心指数" span={2}>
                  <Progress
                    percent={data.probability}
                    status="active"
                    strokeWidth={20}
                  />
                </Descriptions.Item>

                <Descriptions.Item label="录入时间">
                  {data.createTime}
                </Descriptions.Item>
                <Descriptions.Item label="商机状态">
                  {data.statusName}
                </Descriptions.Item>
                <Descriptions.Item label="商机阶段" span={2}>
                  <Stage
                    msg={data.pipelineDetailList}
                    detail={data.pipelineStage}
                  />
                </Descriptions.Item>

                {getDealStatus(data)}
              </Descriptions>
              <div className="ant-descriptions-header">
                <div className="ant-descriptions-title">时间线</div>
              </div>
              <TimeLine />
            </Card>
          )}
        </div>
      </div>
      <FormTrans
        open={modalVis.trans}
        closeModal={closeModal}
        pipelineId={id}
      />
    </>
  );
};

export default Tab1;
