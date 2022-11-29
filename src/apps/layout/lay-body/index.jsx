import React from "react";
import Header from "../header";
import LayMenu from "../lay-menu";
import { NavLink, Link, Outlet } from "react-router-dom";
import { Breadcrumb, Layout, Menu } from "antd";
import "./index.less";

function BodyLayout() {
  const { Content, Footer, Sider } = Layout;
  return (
    <div>
      <section className="body-flex">
        <LayMenu />
        <section style={{ width: "100%" }}>
          {/* 标题 */}
          <Header />
          {/* 主体内容 */}
          <section className="body-main-content">
            <div id="default_content_warp">
              <Outlet />
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}

export default BodyLayout;
