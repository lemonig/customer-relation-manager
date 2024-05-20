import React, { useState, useEffect } from "react";
import {
  Input,
  Space,
  Table,
  Modal,
  Form,
  Tooltip,
  Button,
  Row,
  Col,
  Checkbox,
  InputNumber,
  Layout,
} from "antd";
import { organize } from "@Utils/data";
import { productList, productTypeList } from "@Api/product.js";

function ProductLink({ open, getRowSelected, defaultId, url }) {
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
    productList({}).then((res) => {
      if (res.success) {
        if (defaultId.length) {
          res.data.forEach((item) => {
            defaultId.forEach((jtem) => {
              if (item.id == jtem.productId) {
                item.checked = true;
                item.value = jtem.num;
              }
            });
          });
        }
        setData(res.data);

        // setPagemsg({
        //   ...pageMsg,
        //   pagination: {
        //     ...pageMsg.pagination,
        //     total: res.additional_data.pagination.total,
        //   },
        // });
        // if (!defaultId) {
        //   setRowKey([res.data[0].id]);
        // }
      }
      setLoading(false);
    });
  };

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
  const stepChange = (event, idx) => {
    data[idx].value = event;
    setData([...data]);
    // let idx = event.currentTarget.dataset.index;
    // this.data.list[idx].value = event.detail;
  };
  const onCheckChange = (event, idx) => {
    data[idx].checked = event.target.checked;
    setData([...data]);

    // this.data.list[idx].checked = event.detail;
    // this.setData({
    //   list: [...this.data.list],
    // });
  };

  const modalConfirm = () => {
    let productMsg = data
      .map((item) => {
        if (item.checked) {
          return {
            productId: item.id,
            num: item.value,
          };
        }
      })
      .filter(Boolean);
    getRowSelected(true, productMsg);
  };

  return (
    <>
      {open && (
        <Modal
          title="选择产品"
          open={open}
          onOk={modalConfirm}
          onCancel={() => getRowSelected(false)}
          destroyOnClose
          bodyStyle={{
            padding: "8px",
          }}
          style={{
            top: "0px",
          }}
        >
          <Layout>
            <div style={{ padding: "20px" }}>
              {data.map((item, idx) => (
                <Row key={item.id} style={{ padding: "8px 0" }}>
                  <Col className="gutter-row" span={12}>
                    <Checkbox
                      onChange={(e) => onCheckChange(e, idx)}
                      checked={item.checked}
                    >
                      {item.name} （单位：{item.unit ? item.unit : "--"}）
                    </Checkbox>
                  </Col>

                  <Col span={12} className="gutter-row">
                    <InputNumber
                      min="0"
                      max="1000"
                      onChange={(e) => stepChange(e, idx)}
                      value={item.value}
                      defaultValue={0}
                    />
                  </Col>
                </Row>
              ))}
            </div>
          </Layout>
        </Modal>
      )}
    </>
  );
}

export default ProductLink;
