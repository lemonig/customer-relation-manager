import React, { useState, useEffect } from "react";

import { Alert, Space, Spin, message } from "antd";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { _post, _get } from "../../server/http";
import { userInfo, menuInfo } from "@Api/user.js";

import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "@Store/features/userSlice";
import { SET_MENU } from "@Store/features/menulistSlice";
import { doLoginByTicket, owner, getSsoAuthUrl } from "@Api/user";

function paramObj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
      '"}'
  );
}

const getTicket = async (ticket) => {
  let { code, data } = await doLoginByTicket({ ticket });
  if (code == 200) {
    localStorage.setItem("token", data.access_token);
  } else if (code === 400) {
  }
};

function SpinLoad() {
  let navigate = useNavigate();
  let location = useLocation();
  let dispatch = useDispatch();

  useEffect(() => {
    console.log("loading");

    isLogin();
  }, []);

  const getUserInfo = async () => {
    const { data } = await owner();
    dispatch(SET_USER(data));
    localStorage.setItem("user", JSON.stringify(data));
  };

  const getRouteMenu = async () => {
    let { data } = await menuInfo();
    if (!data.length) {
      // navigate("/403", { replace: true });
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
    // navigate("/", { replace: true });
  };

  const ssoLogin = async () => {
    let { data } = await getSsoAuthUrl({
      clientLoginUrl: `${window.location.origin}`,
    });

    if (data.isLogin) {
      // navigate("/", { replace: true });
    } else {
      window.location.href = data.serverAuthUrl;
    }
  };

  // let hasToken = store.getters['user/token']
  const isLogin = async () => {
    const urlParams = paramObj(window.location.href.replace("#/", ""));
    if (urlParams.ticket) {
      // await store.dispatch('user/exchangeToken', urlParams.ticket)
      await getTicket(urlParams.ticket);
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 50);
      return;
    }
    let token = localStorage.getItem("token");
    if (token) {
      let menuList = localStorage.getItem("menuList");
      if (!menuList) {
        try {
          await getUserInfo();
          await getRouteMenu();
        } catch (err) {
          localStorage.clear();
          navigate("/404");
        }
      }
    } else {
      ssoLogin();
    }
  };

  return (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  );
}

export default SpinLoad;
