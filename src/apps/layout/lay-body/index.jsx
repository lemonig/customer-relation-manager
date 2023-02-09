import React from "react";
import Header from "../header";
import LayMenu from "../lay-menu";
import { NavLink, Link, Outlet } from "react-router-dom";
import { Breadcrumb, Layout, Menu } from "antd";
import "./index.less";

function BodyLayout() {
  const { Content, Footer, Sider } = Layout;
  return (
    <>
      {/* 头部 */}
      <Header />
      <section className="body-flex">
        <LayMenu />
        {/* 主体内容 */}
        <section className="body-main-content">
          <div id="default_content_warp">
            <Outlet />
          </div>
        </section>
      </section>
    </>
  );
}

export default BodyLayout;
