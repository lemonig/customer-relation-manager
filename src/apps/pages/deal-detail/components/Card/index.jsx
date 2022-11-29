import React from "react";
import { Card, Button, Dropdown, Menu, Row, Col } from "antd";
import {
  SearchOutlined,
  ExpandAltOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import IconFont from "@Components/IconFont";
import "./index.less";

function LCard() {
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
  const extraCard = (
    <div>
      <Button icon={<SearchOutlined />} size="small" />
      <Button icon={<ExpandAltOutlined />} size="small" />
      <Dropdown trigger={["click"]} overlay={menu}>
        <Button icon={<EllipsisOutlined />} size="small"></Button>
      </Dropdown>
    </div>
  );
  return (
    <Card
      title="客户公司"
      bordered={false}
      className="l-card card-margin"
      extra={extraCard}
      headStyle={{
        fontSize: "12px",
        color: "#721ea9",
        fontWeight: 600,
      }}
    >
      <Row gutter={[24, 16]}>
        <Col span={10} style={{ textAlign: "right" }}>
          <span className="font-size-12">
            <span className="badge">
              <IconFont
                iconName="gongsi1"
                size="24"
                style={{ margin: "8px" }}
                color="#317ae2"
              />
            </span>
          </span>
        </Col>
        <Col span={14} style={{ textAlign: "left" }}>
          <span className="font-size-12">浙江水电专修瓦聚集</span>
        </Col>
      </Row>
      <Row gutter={[24, 16]}>
        <Col span={10} style={{ textAlign: "right" }}>
          <span className="font-size-12">平湖</span>
        </Col>
        <Col span={14} style={{ textAlign: "left" }}>
          <span className="font-size-12">浙江水电专修瓦聚集</span>
        </Col>
      </Row>
      <Row gutter={[24, 16]}>
        <Col span={10} style={{ textAlign: "right" }}>
          <span className="font-size-12">地址</span>
        </Col>
        <Col span={14} style={{ textAlign: "left" }}>
          <span className="font-size-12">丽水北路</span>
        </Col>
      </Row>
    </Card>
  );
}

export default LCard;
