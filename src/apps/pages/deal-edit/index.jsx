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
  Select,
  Row,
  Col,
  message,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import IconFont from "@Components/IconFont";
import { customerInfo } from "@Api/info_customer.js";
import { saleList, saleStageList } from "@Api/set_sale.js";
import { productList, productTypeList } from "@Api/product.js";
import LinkCustomer from "@Shared/LinkCustomer";
import SelectCompany from "@Components/SelectCompany";
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
import {
  agentPersonInfo,
  agentPersonDelete,
  agentPersonUpdate,
  agentPersonAdd,
} from "@Api/info_agent.js";
import {
  cooperatePersonInfo,
  cooperatePersonDelete,
  cooperatePersonUpdate,
  cooperatePersonAdd,
} from "@Api/info_cooperate.js";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function DealEdit() {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [getParams, setParam] = useSearchParams(); //第一个参数 getParams 获取 param 等 url  信息, 第二个参数 setParam 设置 url 等信息。
  const pipelineId = getParams.getAll("pipelineId")[0];
  const [form] = Form.useForm();
  const [pagedata, setPagedata] = useState(null);

  const [customLink, setCustomerLink] = useState([]); //客户联系人
  const [agentLink, setAgentLink] = useState([]); //招标联系人
  const [cooperateLink, setCooperateLink] = useState([]); //合作联系人
  const [pipeline, setPipeline] = useState([]); //销售流程
  const [pipelineStage, setPipelineStage] = useState([]); //销售流程阶段
  const [productData, setProductData] = useState([]); //销售流程阶段
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkSelected, setLinkSelected] = useState({});

  useEffect(() => {
    getCustomerLink();
    getAgentLink();
    getCooperateLink();
    getPlpeline();
    getProductData();
    const getPageData = async () => {
      let { data } = await dealSingleGet({
        id: pipelineId ?? 2,
      });
      console.log(data);
      setPagedata(data);
      setLinkSelected(data.organization);
      handlePipelineChange(data.pipeline.id);
      form.setFieldsValue({
        ...data,
        pipelineId: data.pipeline.id,
        pipelineStageId: data.pipelineStage.id,
        orgId: data.organization.id,
        personList: data.personList.map((item) => item.id),
        productList: data.productList.map((item) => item.id),
      });
    };
    setTimeout(() => {
      getPageData();
    });
  }, []);

  //获取客户.招标 合作公司 联系人
  const getCustomerLink = async () => {
    let { data } = await customerInfo();
    setCustomerLink(data);
  };
  const getAgentLink = async () => {
    let { data } = await agentPersonInfo();
    setAgentLink(data);
  };
  const getCooperateLink = async () => {
    let { data } = await cooperatePersonInfo();
    setCooperateLink(data);
  };
  //获取产品列表
  const getProductData = async () => {
    let { data } = await productList();
    setProductData(data);
  };

  //销售流程
  const getPlpeline = async () => {
    let { data } = await saleList();
    setPipeline(data);
  };
  const handlePipelineChange = async (val) => {
    console.log(val);
    let { data } = await saleStageList({ pipelineId: val });
    setPipelineStage(data);
  };

  const getRowSelected = (confirm, row) => {
    if (confirm) {
      console.log("confirm");
      form.setFieldValue("orgId", row[0].id);
      setLinkSelected(row[0]);
    }
    setLinkModalOpen(false);
  };
  const inputWidth = 300;

  // 保存
  const handleFormSave = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    values.id = pipelineId;
    console.log(values);
    setLoading(true);
    let { success, message: msg } = await dealUpdate(values);
    if (success) {
      message.success("提交成功");
    } else {
      message.error(msg);
    }
    setLoading(false);
  };
  return (
    pagedata && (
      <>
        <div className="detail-view-wrap">
          <div className="detail-view">
            <PageHeader
              className="site-page-header"
              onBack={() => null}
              title="商机详情"
            />
            <div className=" actions-content">
              <div className="actions">
                <div className="state-actions">
                  <Space>
                    <Button>取消</Button>
                    <Button
                      type="primary"
                      onClick={handleFormSave}
                      loading={loading}
                    >
                      保存
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
            <div className="main-block">
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 15 }}
                autoComplete="off"
                form={form}
              >
                <div className="ant-descriptions-title">基本信息</div>

                <Row gutter={24}>
                  <Col span={11}>
                    <Form.Item name="code" label="商机编号">
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="项目名称" name="title">
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={11}>
                    <Form.Item label="产品信息" name="productList">
                      <Select
                        mode="multiple"
                        placeholder="请选择"
                        fieldNames={{
                          label: "name",
                          value: "id",
                        }}
                        options={productData}
                        optionFilterProp="name"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="预计金额(元)" name="value">
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={11}>
                    <Form.Item label="销售流程" name="pipelineId">
                      <Select
                        placeholder="请选择"
                        fieldNames={{
                          label: "name",
                          value: "id",
                        }}
                        options={pipeline}
                        onChange={handlePipelineChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="销售流程阶段" name="pipelineStageId">
                      <Select
                        placeholder="请选择"
                        fieldNames={{
                          label: "name",
                          value: "id",
                        }}
                        options={pipelineStage}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={11}>
                    <Form.Item label="信心指数" name="probability">
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={11}>
                    <Form.Item label="备注" name="description">
                      <Input.TextArea placeholder="请输入" />
                    </Form.Item>
                  </Col>
                </Row>
                <div className="ant-descriptions-title">信息维护</div>

                <Row gutter={24}>
                  <Col span={11}>
                    <Form.Item label="客户名称" name="orgId">
                      <Select
                        placeholder="请选择"
                        onClick={() => setLinkModalOpen(true)}
                        dropdownStyle={{
                          display: "none",
                        }}
                        autoFocus
                        options={[
                          {
                            label: linkSelected.name,
                            value: linkSelected.id,
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="最终用户" name="isFinalOrg">
                      <Select
                        placeholder="请选择"
                        options={[
                          {
                            value: true,
                            label: "是",
                          },
                          {
                            value: false,
                            label: "否",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={11}>
                    <Form.Item label="主要联系人" name="personList">
                      <Select
                        mode="multiple"
                        fieldNames={{
                          label: "name",
                          value: "id",
                        }}
                        options={customLink}
                        placeholder="请选择"
                        optionFilterProp="name"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={11}>
                    <Form.Item label="招标公司" name="biddingAgencyId">
                      <SelectCompany url="zb" />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="联系人" name="biddingAgencyPersonId">
                      <Select
                        fieldNames={{
                          label: "name",
                          value: "id",
                        }}
                        options={agentLink}
                        placeholder="请选择"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {/* 合作伙伴 */}
                <Form.List name="partnerList">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row
                          gutter={24}
                          key={key}
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Col span={11}>
                            <Form.Item
                              {...restField}
                              name={[name, "partnerId"]}
                              label="合作伙伴"
                            >
                              <SelectCompany url="hz" />
                            </Form.Item>
                          </Col>
                          <Col span={11}>
                            <Form.Item
                              {...restField}
                              name={[name, "partnerPersonId"]}
                              label="联系人"
                            >
                              <Select
                                fieldNames={{
                                  label: "name",
                                  value: "id",
                                }}
                                options={cooperateLink}
                                placeholder="请选择"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(name)}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Row gutter={24}>
                        <Col span={11}>
                          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                            >
                              添加合作伙伴
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form.List>
                {/* 优劣分析 */}
                <Form.List name="competitorList">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={24} key={key} align="baseline">
                          <Col span={11}>
                            <Form.Item
                              {...restField}
                              name={[name, "competitorId"]}
                              label="竞争对手"
                            >
                              <SelectCompany url="jz" />
                            </Form.Item>
                          </Col>
                          <Col span={11}>
                            <Form.Item
                              {...restField}
                              name={[name, "description"]}
                              label="优劣势分析"
                            >
                              <Input.TextArea placeholder="请输入" />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(name)}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Row gutter={24}>
                        <Col span={11}>
                          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                            >
                              添加竞争对手
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form.List>
                <Row gutter={24}>
                  <Col span={11}>
                    <Form.Item label="备注" name="description">
                      <Input.TextArea placeholder="请输入" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
        {linkModalOpen && (
          <LinkCustomer
            open={linkModalOpen}
            getRowSelected={getRowSelected}
            defaultId={linkSelected.id}
          />
        )}
      </>
    )
  );
}

export default DealEdit;