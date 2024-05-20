import { message } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { _post, _get } from "../../server/http";
import { userInfo, menuInfo } from "@Api/user.js";

import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "@Store/features/userSlice";
import { SET_MENU } from "@Store/features/menulistSlice";
import "./index.less";
import { doLoginByTicket, owner, getSsoAuthUrl } from "@Api/user";

const LoadPage = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let dispatch = useDispatch();
  useEffect(() => {
    // getRouteMenu();
    // navigate("/", { replace: true });
  }, []);

  useEffect(() => {
    let href = window.location.href; // 完整的url路径
    let search = location.search; // 获取从？开始的部分
    if (location.search) {
      let url = decodeURI(search);
      let ticket = url.split("&")[1].split("=")[1];
      getTicket(ticket);
    } else {
      ssoLogin();
    }

    window.onhashchange = function (event) {};
  });

  const ssoLogin = async () => {
    let { data } = await getSsoAuthUrl({
      clientLoginUrl: `${window.location.origin}/loading`,
    });

    if (data.isLogin) {
      navigate("/", { replace: true });
    } else {
      window.location.href = data.serverAuthUrl;
    }
  };

  const getTicket = async (ticket) => {
    let { code, data } = await doLoginByTicket({ ticket });
    if (code == 200) {
      localStorage.setItem("token", data.access_token);
      await getUserInfo();
      await getRouteMenu();
    } else if (code === 400) {
    }
  };

  const getUserInfo = async () => {
    const { data } = await owner();
    if (data) {
      dispatch(SET_USER(data));
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  const getRouteMenu = async () => {
    let { data } = await menuInfo();
    if (!data.length) {
      navigate("/403", { replace: true });
      return;
    }
    data[0].index = true;
    data.map((item) => {
      if (!item.visible) {
        delete item.pid;
      }
    });
    dispatch(SET_MENU(data));
    localStorage.setItem("menuList", JSON.stringify(data));
    navigate("/", { replace: true });
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
