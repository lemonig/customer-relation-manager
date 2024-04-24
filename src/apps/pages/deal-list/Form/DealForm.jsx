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
  Typography,
  Tooltip,
  PageHeader,
  InputNumber,
} from "antd";
import { dealadd, dealCodeGet } from "@Api/deal_list";
import { customerInfo } from "@Api/info_customer.js";
import { saleList, saleStageList } from "@Api/set_sale.js";
import { productList, productTypeList } from "@Api/product.js";
import { ExclamationCircleOutlined, DownOutlined } from "@ant-design/icons";
import LinkCustomer from "@Shared/LinkCustomer";
import ProductLink from "./ProductLink";

function DealForm({ isModalOpen, closeModal, data }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [linkSelected, setLinkSelected] = useState({});
  const [customLink, setCustomerLink] = useState([]); //客户联系人
  const [pipeline, setPipeline] = useState([]); //销售流程
  const [pipelineStage, setPipelineStage] = useState([]); //销售流程阶段
  const [productData, setProductData] = useState([]); //销售流程阶段
  const [productSelected, setProductSelected] = useState([]);

  useEffect(() => {
    getCustomerLink();
    getPlpeline();
    getProductData();
  }, []);

  //获取客户公司
  const getCustomerLink = async () => {
    let { data } = await customerInfo();
    setCustomerLink(data);
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
    form.setFieldValue("pipelineId", data[0].id);
    if (data[0]?.id) {
      handlePipelineChange(data[0].id);
    }
  };
  // 新建
  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);

    values.dealProductList = productSelected;

    let { success, message: msg } = await dealadd(values);
    if (success) {
      message.success("提交成功");
      closeModal(true);
    } else {
      message.error(msg);
    }
    setLoading(false);
  };

  const getRowSelected = (confirm, row) => {
    if (confirm) {
      form.setFieldValue("orgId", row[0].id);
      setLinkSelected(row[0]);
    }
    setLinkModalOpen(false);
  };

  const getProSelected = (confirm, row) => {
    if (confirm) {
      console.log(row);
      // form.setFieldValue("orgId", row[0].id);
      // setLinkSelected(row[0]);
      setProductSelected(row);
    }
    setProModalOpen(false);
  };

  const getDealCode = async () => {
    let orgId = form.getFieldValue("orgId");
    if (orgId) {
      let { data, success, message: msg } = await dealCodeGet({ orgId });
      if (success && data.code) {
        form.setFieldValue("code", data.code);
      } else {
        message.error(msg);
      }
    } else {
      message.warn("请先选择客户");
    }
  };
  const handlePipelineChange = async (val) => {
    let { data } = await saleStageList({ pipelineId: val });
    setPipelineStage(data);
    if (data[0]?.id) {
      form.setFieldValue("pipelineStageId", data[0].id);
    }
  };
  return (
    <>
      <Modal
        title="新建"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          name="deal-list"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          initialValues={{
            isFinalOrg: true,
          }}
          form={form}
        >
          <Form.Item
            label="客户名称"
            name="orgId"
            rules={[{ required: true, message: "请选择客户!" }]}
          >
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
          <Form.Item
            label="商机名称"
            name="title"
            rules={[{ required: true, message: "商机名称!" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          {/* <Form.Item
            label="商机编号"
            name="code"
            rules={[{ required: true, message: "请输入商机编号!" }]}
          >
            <Space>
              <Form.Item name="code" noStyle>
                <Input style={{ width: 200 }} placeholder="请输入" />
              </Form.Item>
              <Button type="link" onClick={getDealCode}>
                获取商机编码
              </Button>
            </Space>
          </Form.Item> */}
          <Form.Item label="销售阶段" name="pipelineStageId">
            <Select
              placeholder="请选择"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              options={pipelineStage}
            />
          </Form.Item>
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
          <Form.Item label="业务类型" name="businessType">
            <Select
              placeholder="请选择"
              options={[
                {
                  value: "1",
                  label: "普通业务",
                },
                {
                  value: "2",
                  label: "拓展业务",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="信心指数" name="probability">
            <Select
              placeholder="请选择"
              options={[
                {
                  label: "90%",
                  value: 90,
                },

                {
                  label: "70%",
                  value: 70,
                },

                {
                  label: "50%",
                  value: 50,
                },

                {
                  label: "30%",
                  value: 30,
                },

                {
                  label: "10%",
                  value: 10,
                },
              ]}
            />
          </Form.Item>
          {/* <Form.Item label="主要联系人" name="personList">
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
          </Form.Item> */}

          <Form.Item label="预计金额(元)" name="value">
            <InputNumber
              placeholder="请输入"
              addonAfter="￥"
              formatter={(value) =>
                `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\￥\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item label="产品信息">
            {!!productSelected.length && `已选 ${productSelected.length}个`}
            <Button type="link" onClick={() => setProModalOpen(true)}>
              选择产品
            </Button>
          </Form.Item>
          <Form.Item label="备注" name="description">
            <Input.TextArea placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
      {linkModalOpen && (
        <LinkCustomer
          open={linkModalOpen}
          getRowSelected={getRowSelected}
          defaultId={linkSelected.id}
        />
      )}
      {proModalOpen && (
        <ProductLink
          open={proModalOpen}
          getRowSelected={getProSelected}
          defaultId={productSelected}
        />
      )}
    </>
  );
}

export default DealForm;
