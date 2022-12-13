import React, { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Card,
  Avatar,
  Image,
  Button,
  Dropdown,
  Menu,
  Divider,
  Statistic,
  Form,
  Modal,
  Input,
  Descriptions,
  Progress,
  PageHeader,
  Space,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import IconFont from "@Components/IconFont";
import Stage from "./components/Stage/index";
import "./index.less";
import {
  dealPage,
  dealSingleGet,
  dealList,
  dealadd,
  dealUpdate,
  dealCodeGet,
  dealChart,
  dealExport,
} from "@Api/deal_list";

function DealDetail() {
  const params = useParams();
  let navigate = useNavigate();
  const [getParams, setParam] = useSearchParams(); //第一个参数 getParams 获取 param 等 url  信息, 第二个参数 setParam 设置 url 等信息。
  const pipelineId = getParams.getAll("pipelineId")[0];
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(null);

  console.log(pipelineId);
  useEffect(() => {
    const getPageData = async () => {
      let { data } = await dealSingleGet({
        id: pipelineId,
      });
      console.log(data);
      setData(data);
    };
    getPageData();
  }, []);

  // 弹窗表单
  const handleFormOk = () => {};
  const handleFormCancel = () => {};
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: <Button type="link">转移</Button>,
        },
        {
          key: "2",
          label: <Button type="link">终止</Button>,
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

  return (
    <div className="detail-view-wrap">
      <div className="detail-view">
        <PageHeader
          className="site-page-header"
          onBack={() => null}
          title="商机详情"
        />
        <div className="actions-content">
          <div className="actions">
            <div className="state-actions">
              <Space>
                <Button onClick={handleEdit}>编辑</Button>
                <Divider
                  type="vertical"
                  style={{
                    borderLeft: "2px  solid rgba(0, 0, 0, 0.15)",
                    height: "2em",
                  }}
                />
                <Button type="primary" danger>
                  赢单
                </Button>
                <Button type="primary" style={{ background: "#119143" }}>
                  丢单
                </Button>
              </Space>
            </div>
            <Dropdown trigger={["click"]} overlay={menu}>
              <Button icon={<EllipsisOutlined />}></Button>
            </Dropdown>
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
                    {data.value}
                  </Descriptions.Item>
                  <Descriptions.Item label="产品信息" span={2}>
                    {data.productList.map((item) => item.name + ", ")}
                  </Descriptions.Item>
                  <Descriptions.Item label="备注" span={2}>
                    {data.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="销售阶段" span={2}>
                    <Stage msg={data.pipelineDetailList} />
                  </Descriptions.Item>
                  <Descriptions.Item label="信心指数" span={2}>
                    <Progress
                      percent={data.probability}
                      status="active"
                      strokeWidth={20}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="商机状态" span={2}>
                    {data.status}
                  </Descriptions.Item>
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
              </Card>
            )}
          </div>
          <div className="content">
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
          </div>
        </div>
      </div>

      {/* 弹窗 */}
      <Modal
        title={`${"xx"}目标`}
        open={modalVisible}
        onOk={handleFormOk}
        onCancel={handleFormCancel}
        destroyOnClose
        maskClosable={false}
      >
        <div>
          <Form
            form={form}
            preserve={false}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Form.Item
              name="content"
              label="目标"
              rules={[
                {
                  required: true,
                  message: "请输入目标!",
                },
              ]}
            ></Form.Item>
            <Form.Item name="weight" label="权重">
              <Input type="number" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default DealDetail;
