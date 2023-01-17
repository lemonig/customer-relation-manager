import { message } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { _post, _get } from "../../server/http";
import { userInfo, menuInfo } from "@Api/user.js";

import { useDispatch, useSelector } from "react-redux";
import { SET_MENU } from "@Store/features/userSlice";
import "./index.less";

const LoadPage = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let dispatch = useDispatch();
  useEffect(() => {
    getRouteMenu();
    // navigate("/", { replace: true });
  }, []);

  useEffect(() => {
    let href = window.location.href; // 完整的url路径
    let search = location.search; // 获取从？开始的部分
    // let url = decodeURI(search);
    // let code = url.split("&")[0].split("=")[1];
    // (code);
    // getTicket(code);

    // window.onhashchange = function (event) {};
  });
  const getTicket = async (ticket) => {
    let { code, data } = await _post(`api/sso/doLoginByTicket`, {
      ticket,
    });
    if (code == 200) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/", { replace: true });
    }
  };

  const getRouteMenu = async () => {
    let { data } = await menuInfo();
    data[0].index = true;
    data.map((item) => {
      if (!item.visible) {
        delete item.pid;
      }
    });
    localStorage.setItem("menuList", data);
    dispatch(SET_MENU(data));
    console.log(data);
  };

  return (
    <div className="loader">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default LoadPage;
