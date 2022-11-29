import React, { useState } from "react";
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
  Tabs,
} from "antd";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
const tabList = [
  {
    key: "tab1",
    tab: "tab1",
  },
  {
    key: "tab2",
    tab: "tab2",
  },
];
const contentList = {
  tab1: <p>content1</p>,
  tab2: <p>content2</p>,
};
const tabListNoTitle = [
  {
    key: "article",
    tab: (
      <span>
        <AndroidOutlined />
        animal
      </span>
    ),
  },
  {
    key: "app",
    tab: (
      <span>
        <AndroidOutlined />
        日记
      </span>
    ),
  },
  {
    key: "project",
    tab: (
      <span>
        <AppleOutlined />
        电话
      </span>
    ),
  },
];
const contentListNoTitle = {
  article: <p>article content</p>,
  app: <p>app content</p>,
  project: <p>project content</p>,
};
function PipeNote() {
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");
  const [activeTabKey2, setActiveTabKey2] = useState("app");
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };
  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };
  return (
    <div className="flow-wrapper">
      <Card
        style={{
          width: "100%",
        }}
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        tabBarExtraContent={<a href="#">More</a>}
        onTabChange={(key) => {
          onTab2Change(key);
        }}
        tabProps={
          {
            // type: "card",
          }
        }
      >
        {contentListNoTitle[activeTabKey2]}
      </Card>
    </div>
  );
}

export default PipeNote;
