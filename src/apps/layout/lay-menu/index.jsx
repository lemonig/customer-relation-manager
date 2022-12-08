import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ContainerOutlined,
  MailOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import "./index.less";
import IconFont from "@Components/IconFont";
import { useDispatch, useSelector } from "react-redux";
import { handleMenu } from "@Utils/menu";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/image/logo.png";
const { Header, Content, Footer, Sider } = Layout;
// function getItem(label, key, icon, children, type) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   };
// }
// const items = [
//   getItem("工作台历", "1", <PieChartOutlined />),
//   getItem("Option 2", "2", <DesktopOutlined />),
//   getItem("Option 3", "3", <ContainerOutlined />),
//   getItem("商机行为", "sub1", <MailOutlined />, [
//     getItem("商机列表", "5"),
//     getItem("商机漏斗", "6"),
//   ]),
//   getItem("行为管理", "sub2", <AppstoreOutlined />, [
//     getItem("销售计划", "9"),
//     getItem("工作报告", "10"),
//     getItem("Submenu", "sub3", null, [
//       getItem("Option 11", "11"),
//       getItem("Option 12", "12"),
//     ]),
//   ]),
// ];

// const items = [
//   {
//     path: "/",
//     name: "Root",
//     component: "Layout",
//     meta: {
//       title: "员工管理",
//       icon: "Menu",
//       hidden: false,
//       levelHidden: false,
//       dynamicNewTab: false,
//       noClosable: false,
//     },
//   },
//   { label: "菜单项二", key: "item-2" },
//   {
//     label: "子菜单",
//     key: "submenu",
//     children: [{ label: "子菜单项", key: "submenu-item-1" }],
//   },
// ];
function LayMenu() {
  const navigate = useNavigate();
  const menu = handleMenu();
  const handleMenuClick = ({ item, key, keyPath }) => {
    navigate(item.props.path);
  };

  return (
    <div
      className="menu-warp"
      style={{
        background: "#1b1a40",
      }}
    >
      <Sider
        collapsible
        theme="dark"
        style={{ background: "#1b1a40", color: "#fff" }}
      >
        <div className="logo">
          {/* <IconFont iconName="crm" size="24"></IconFont> */}
          <img src={logo} alt="logo" height={50} />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={menu}
          style={{ background: "#1b1a40", color: "#fff" }}
          onClick={handleMenuClick}
        />
      </Sider>
    </div>
  );
}

export default LayMenu;
