import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
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
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Stage from "./components/Stage/index";
import "./index.less";
import { dealSingleGet, dealwin, dealReopen } from "@Api/deal_list";
import FormTrans from "./components/Form/FormTrans";
import FormLose from "./components/Form/FormLose";
import FormSop from "./components/Form/FormSop";
import Logs from "./components/Logs";
import TabView from "./components/TabView";
import confetti from "canvas-confetti";
const { confirm } = Modal;

function DealDetail() {
  const params = useParams();
  let navigate = useNavigate();
  const [getParams, setParam] = useSearchParams();
  const pipelineId = getParams.getAll("pipelineId")[0];
  const [data, setData] = useState(null);
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
      id: pipelineId,
    });
    setData(data);
  };
  // 弹窗表单
  const handleFormOk = () => {};
  const handleFormCancel = () => {};
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
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
          ),
        },
        {
          key: "2",
          label: (
            <Button
              type="link"
              onClick={() => {
                setModalVis({
                  ...modalVis,
                  stop: true,
                });
              }}
            >
              终止
            </Button>
          ),
        },
      ]}
    />
  );
  // 编辑
  const handleEdit = () => {
    navigate({
      pathname: "/dealEdit",
      search: `?pipelineId=${pipelineId}`,
    });
  };

  //表单回调
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
  const handleWinDeal = () => {
    confirm({
      title: "确定赢单?",
      icon: <ExclamationCircleOutlined style={{ color: "#F5222D" }} />,
      content: "确认后无法撤销",
      async onOk() {
        return new Promise((resolve, reject) => {
          var duration = 15 * 1000;
          var animationEnd = Date.now() + duration;
          var defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 0,
          };

          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }

          dealwin({ id: pipelineId }).then((res) => {
            if (res.success) {
              resolve();
              message.success("提交成功");
              getPageData();
              var interval = setInterval(function () {
                var timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) {
                  return clearInterval(interval);
                }
                var particleCount = 50 * (timeLeft / duration);
                confetti({
                  ...defaults,
                  particleCount,
                  origin: {
                    x: randomInRange(0.1, 0.3),
                    y: Math.random() - 0.2,
                  },
                });
                confetti({
                  ...defaults,
                  particleCount,
                  origin: {
                    x: randomInRange(0.7, 0.9),
                    y: Math.random() - 0.2,
                  },
                });
              }, 250);
            } else {
              reject();
              message.error(res.message);
            }
          });
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
  };

  const reopenDeal = () => {
    confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "是否重新打开？",
      async onOk() {
        return new Promise((resolve, reject) => {
          var duration = 15 * 1000;
          var animationEnd = Date.now() + duration;
          var defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 0,
          };

          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }

          dealReopen({ id: pipelineId }).then((res) => {
            if (res.success) {
              resolve();
              message.success(res.message);
              getPageData();
            } else {
              reject();
              message.error(res.message);
            }
          });
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
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

  const getDealTagColor = (idx) => {
    if (!idx) {
      return;
    }
    let colors = ["#ff7875", "#ff7875", "default"];
    return colors[Number(idx) - 2];
  };

  return (
    <div className="detail-view-wrap">
      <div className="detail-view">
        <PageHeader
          className="site-page-header"
          style={{ padding: "0 24px" }}
          onBack={() => navigate(-1, {})}
          title="商机详情"
          extra={
            [
              // <Button
              //   key="3"
              //   type="link"
              //   onClick={() => {
              //     setModalVis({
              //       ...modalVis,
              //       logs: true,
              //     });
              //   }}
              // >
              //   变更日志
              // </Button>,
            ]
          }
        />
        <div className="actions-content">
          <div className="actions">
            <div className="state-actions">
              {data && data?.status === "1" ? (
                <Space>
                  <Button onClick={handleEdit}>编辑</Button>
                  <Divider
                    type="vertical"
                    style={{
                      borderLeft: "2px  solid rgba(0, 0, 0, 0.15)",
                      height: "2em",
                    }}
                  />
                  <Button type="primary" danger onClick={handleWinDeal}>
                    赢单
                  </Button>
                  <Button
                    type="primary"
                    style={{ background: "#119143" }}
                    onClick={() => {
                      setModalVis({
                        ...modalVis,
                        lose: true,
                      });
                    }}
                  >
                    丢单
                  </Button>

                  <Button
                    onClick={() => {
                      setModalVis({
                        ...modalVis,
                        trans: true,
                      });
                    }}
                  >
                    转移
                  </Button>

                  <Button
                    onClick={() => {
                      setModalVis({
                        ...modalVis,
                        stop: true,
                      });
                    }}
                  >
                    终止
                  </Button>
                </Space>
              ) : (
                <Space>
                  <Button onClick={reopenDeal}>重新打开</Button>

                  <Tag
                    color={getDealTagColor(data?.status)}
                    style={{ borderRadius: "30%" }}
                  >
                    {data?.statusName}
                  </Tag>
                </Space>
              )}
            </div>
          </div>
        </div>
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
                <Descriptions title="基本信息" column={2}>
                  <Descriptions.Item label="商机编号">
                    {data.code}
                  </Descriptions.Item>
                  <Descriptions.Item label="项目名称">
                    {data.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="销售人员">
                    {data.ownerUserName}
                  </Descriptions.Item>
                  <Descriptions.Item label="预计金额（元）">
                    <Statistic
                      value={data.value}
                      valueStyle={{ fontSize: "12px" }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="产品信息">
                    {data.productList.map((item) => item.name + ", ")}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {data.createTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="备注" span={2}>
                    {data.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="销售阶段" span={2}>
                    <Stage
                      msg={data.pipelineDetailList}
                      detail={data.pipelineStage}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="信心指数" span={2}>
                    <Progress
                      percent={data.probability}
                      status="active"
                      strokeWidth={20}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="商机状态">
                    {data.statusName}
                  </Descriptions.Item>
                  {getDealStatus(data)}
                </Descriptions>
                {/* 信息维护 */}
                <Descriptions title="信息维护" column={2}>
                  <Descriptions.Item label="客户名称">
                    {data.organization.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="最终用户">
                    {data.isFinalOrg ? "是" : "否"}
                  </Descriptions.Item>
                  <Descriptions.Item label="主要联系人" span={2}>
                    {data.personList.map((item) => item.name + ", ")}
                  </Descriptions.Item>
                  <Descriptions.Item label="招标公司">
                    {data.biddingAgency.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="联系人">
                    {data.biddingAgencyPerson.name}
                  </Descriptions.Item>
                  {data.partnerList.map((item) => (
                    <React.Fragment key={item.id}>
                      <Descriptions.Item label="合作伙伴">
                        {item.partnerName}
                      </Descriptions.Item>
                      <Descriptions.Item label="联系人">
                        {item.partnerPersonName}
                      </Descriptions.Item>
                    </React.Fragment>
                  ))}

                  {data.competitorList.map((item) => (
                    <React.Fragment key={item.id}>
                      <Descriptions.Item label="竞争对手" span={2}>
                        {item.competitorName}
                      </Descriptions.Item>
                      <Descriptions.Item label="优劣势分析" span={2}>
                        {item.description}
                      </Descriptions.Item>
                    </React.Fragment>
                  ))}
                </Descriptions>
                <TabView />
              </Card>
            )}
          </div>
          {/* <div className="content">
            <Card
              title="销售计划"
              bordered={false}
              className="l-card card-margin"
              headStyle={{
                fontSize: "12px",
                color: "#721ea9",
                fontWeight: 600,
              }}
            ></Card>
            <Card
              title="工作日志"
              bordered={false}
              className="l-card card-margin"
              headStyle={{
                fontSize: "12px",
                color: "#721ea9",
                fontWeight: 600,
              }}
            ></Card>
          </div> */}
        </div>
      </div>

      {/* 弹窗 */}
      <FormTrans
        open={modalVis.trans}
        closeModal={closeModal}
        pipelineId={pipelineId}
      />
      <FormLose
        open={modalVis.lose}
        closeModal={closeModal}
        pipelineId={pipelineId}
      />
      <FormSop
        open={modalVis.stop}
        closeModal={closeModal}
        pipelineId={pipelineId}
      />
      {modalVis.logs ? (
        <Logs
          open={modalVis.logs}
          closeModal={closeModal}
          pipelineId={pipelineId}
        />
      ) : null}
    </div>
  );
}

export default DealDetail;
