import React, { useState } from "react";
import { Layout, Menu } from "antd";
import "./index.less";
import { useDispatch } from "react-redux";
import { SELECT_MENU, OPEN_EKY } from "@Store/features/menuSlice";
import { handleMenu } from "@Utils/menu";
import { useNavigate, useResolvedPath } from "react-router-dom";
import { useEffect } from "react";
const { Sider } = Layout;

function LayMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  const menu = JSON.parse(localStorage.getItem("menuList"));
  const menuList = menu ? handleMenu(menu) : [];
  let resolvedPath = useResolvedPath();

  const handleOpen = (openKeys) => {
    // open keys数组集合
    dispatch(OPEN_EKY(openKeys));
    setOpenKeys(openKeys);
  };

  useEffect(() => {
    let path = resolvedPath.pathname.replace("/", "");
    let res = menu.find((item) => item.path === path);
    if (res) {
      setSelectedKeys([`${res.id}`]);
      setOpenKeys([`${res.pid}`]);
      dispatch(SELECT_MENU(`${res.id}`));
      dispatch(OPEN_EKY(`${res.pid}`));
    }
  }, []);

  const handleMenuClick1 = ({ item, key, keyPath, selectedKeys }) => {
    console.log(item);
    setSelectedKeys(selectedKeys);
    if (item.props.path) {
      navigate(item.props.path);
    } else {
      navigate("/");
    }
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
        style={{ background: "#1b1a40", color: "#fff", height: "100%" }}
      >
        <div className="menu">
          <Menu
            theme="dark"
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            mode="inline"
            items={menuList}
            style={{
              background: "#1b1a40",
              color: "#fff",
              overflow: "hidden auto",
            }}
            onOpenChange={handleOpen}
            onSelect={handleMenuClick1}
          />
        </div>
      </Sider>
    </div>
  );
}

export default LayMenu;
