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
import { SELECT_MENU, OPEN_EKY } from "@Store/features/menuSlice";
import { handleMenu } from "@Utils/menu";
import { useNavigate } from "react-router-dom";
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

function LayMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const treeKey = useSelector((state) => state.menuKey.key);
  const openKey = useSelector((state) => state.menuKey.openKey);
  console.log(openKey);
  const menu = handleMenu();
  const handleMenuClick = ({ item, key, keyPath }) => {
    // console.log(key);
    // console.log(item);
    navigate(item.props.path);
    dispatch(SELECT_MENU(key));
  };
  const handleOpen = (openKeys) => {
    console.log(openKeys);
    // open keys数组集合
    dispatch(OPEN_EKY(openKeys));
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
        <Menu
          theme="dark"
          defaultOpenKeys={openKey}
          defaultSelectedKeys={[treeKey]}
          mode="inline"
          items={menu}
          style={{ background: "#1b1a40", color: "#fff" }}
          onClick={handleMenuClick}
          onOpenChange={handleOpen}
        />
      </Sider>
    </div>
  );
}

export default LayMenu;
