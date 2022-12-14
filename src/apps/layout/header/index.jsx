import React, { useState, useEffect } from "react";
import IconFont from "../../components/IconFont";
import "./index.less";
import { fullScreen, exitScreen, isFullScreen } from "../../core/fullScreen";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { Avatar, Image, Badge } from "antd";
import User from "./use";
import { _post } from "../../server/http";
import store from "@Store";
import logo from "../../../assets/image/logo.png";

import { connect } from "react-redux";

const Header = ({ message }) => {
  const [fullOrno, setfullOrno] = useState(true);
  const [nowPage, setNowPage] = useState(""); //aim matrix
  useEffect(() => {
    let url = window.location.pathname.substring(1);
    if (!!url) {
      setNowPage("matrix");
    } else {
      setNowPage("aim");
    }
  }, []);

  let navigate = useNavigate();
  const tabItem = [
    {
      name: "test",
      text: "测试",
      path: "/test",
      icon: "youji",
    },
    {
      name: "map",
      text: "站点地图",
      path: "/map",
      icon: "zhandianditu",
    },
    {
      name: "realtime",
      text: "实时列表",
      path: "/home",
      icon: "shujukanban",
    },
    {
      name: "project",
      text: "项目管理",
      path: "/project",
      icon: "navicon-jgda",
    },
    {
      name: "factor",
      text: "因子管理",
      path: "/factor",
      icon: "network",
    },
    {
      name: "station",
      text: "国控站管理",
      path: "/station",
      icon: "zuzhiqunzu",
    },
  ];

  const screenClick = () => {
    if (!isFullScreen()) {
      fullScreen();
      setfullOrno(false);
    } else {
      exitScreen();
      setfullOrno(true);
    }
  };

  const handleTabChange = (name) => {
    switch (name) {
      case "realtime":
        break;
      case "project":
        break;
      case "factor":
        break;
      case "station":
        break;
      default:
    }
  };
  let activeStyle = {
    color: "#fff",
    background: "#07357b",
  };
  const creatMenu = () => {
    let res = tabItem.map((item) => {
      return (
        <React.Fragment key={item.name}>
          <NavLink
            to={item.path}
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            <li className="li-outer">
              <div
                className="tab-item"
                onClick={() => handleTabChange(item.name)}
              >
                <IconFont iconName={item.icon} size="16" />
                <span style={{ marginLeft: "4px" }}>{item.text} </span>
              </div>
            </li>
          </NavLink>
        </React.Fragment>
      );
    });
    return res;
  };

  const handleGotoComment = () => {
    navigate("comment");
  };

  const gotoHome = () => {
    setNowPage("aim");
    navigate("/");
  };
  const gotoMatrix = () => {
    setNowPage("matrix");
    navigate("/matrix");
  };
  const gotoNotice = () => {
    setNowPage("notification");
    navigate("/notification");
  };

  return (
    <>
      <div className="page-title">
        <div className="title" onClick={gotoHome}>
          {/* <img width={25} src={biaoti} alt="" /> */}
          {/* <div className="logo"> */}
          {/* <IconFont iconName="crm" size="24"></IconFont> */}
          {/* <img src={logo} alt="logo" height={50} /> */}
          {/* </div> */}
          <span style={{ fontSize: "22px", marginLeft: "8px" }}>
            杭州绿洁销售管理系统
          </span>
        </div>

        <div className="title-wrap">
          <div
            className={`tab-item ${nowPage === "aim" ? "active" : ""}`}
            onClick={gotoHome}
          ></div>
          <div
            className={`tab-item ${nowPage === "matrix" ? "active" : ""}`}
            onClick={gotoMatrix}
          ></div>
          <div
            className={`tab-item ${nowPage === "notification" ? "active" : ""}`}
            onClick={gotoNotice}
          ></div>
        </div>

        <div className="head-right">
          <ul className="head-ul">
            {/* {
              fullOrno ?
                <li className="li-outer scrren">
                  <div className="tab-item" onClick={screenClick}>
                    <IconFont iconName="quanping" size="14" />

                    <span style={{ marginLeft: '4px' }}>全屏</span>
                  </div>
                </li>
                :
                <li className="li-outer scrren">
                  <div className="tab-item" onClick={screenClick}>
                    <IconFont iconName="huanyuanhuabu" size="14" />
                    <span style={{ marginLeft: '4px' }}>取消</span>
                  </div>
                </li>
            } */}
            <li
              className="li-outer"
              style={{ marginRight: "25px" }}
              onClick={handleGotoComment}
            >
              {/* <Badge count={message.value}>
                <IconFont iconName="lingdang" size="24" />
              </Badge> */}
            </li>
            <li className="li-outer">
              <User></User>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
