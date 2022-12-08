import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import IconFont from "@Components/IconFont";
import Stage from "./components/Stage/index";
import "./index.less";
import LCard from "./components/Card"; //通用组件
import PipeNote from "./components/PipeNote"; //业务组件

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.antgroup.com"
          >
            1st menu item
          </a>
        ),
      },
      {
        key: "2",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.aliyun.com"
          >
            2nd menu item
          </a>
        ),
      },
      {
        key: "3",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            3rd menu item
          </a>
        ),
      },
    ]}
  />
);

function DealDetail() {
  const params = useParams();
  const [getParams, setParam] = useSearchParams(); //第一个参数 getParams 获取 param 等 url  信息, 第二个参数 setParam 设置 url 等信息。
  const name = getParams.getAll("id");
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  // 弹窗表单
  const handleFormOk = () => {};
  const handleFormCancel = () => {};
  return (
    <div className="detail-view-wrap">
      <div className="detail-view">
        <Card
          style={{
            margin: "24px 24px 0",
          }}
        >
          <div className="content actions-content">
            <div className="actions">
              <div className="owner-view">
                <div className="owner">
                  <Avatar
                    src={
                      <Image
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                        style={{ width: 32 }}
                        preview={false}
                      />
                    }
                  />
                  <div className="info">
                    <span className="name">李大钊</span>
                    <span className="role">all man</span>
                  </div>
                </div>
              </div>
              <div className="state-actions">
                <Button type="primary" danger>
                  赢单
                </Button>
                <Button
                  type="primary"
                  style={{ background: "#119143", marginLeft: "16px" }}
                >
                  丢单
                </Button>
              </div>

              <Dropdown trigger={["click"]} overlay={menu}>
                <Button icon={<EllipsisOutlined />}></Button>
              </Dropdown>
            </div>
            <div className="description-head">
              <h1>
                <a className="editable title" style={{ maxWidth: "933px" }}>
                  年底大促销采购
                </a>
              </h1>
            </div>
          </div>
          <div className="content value-related-itemsc-content">
            <span style={{ display: "inline-block" }}>
              <Statistic value={112893} />
            </span>
            <Divider type="vertical" style={{}} />
            <IconFont iconName="ren" size="32"></IconFont>
            <span>赵四</span>
            <Divider type="vertical" />
            <IconFont iconName="gongsi" size="32"></IconFont>
            <span>平湖</span>
          </div>

          <Stage />
        </Card>
        <div className="main-block">
          <div className="sidebar">
            <LCard></LCard>
            <LCard></LCard>
            <LCard></LCard>
          </div>
          <div className="content">
            <PipeNote />
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
