import React from "react";
import { matchRoutes, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export const RouterAuth = ({ children }) => {
  // const router = useSelector((state) => state);
  const router = JSON.parse(localStorage.getItem("menuList"));
  const location = useLocation();
  console.log(router);

  // const { isLogin } = useAuth()
  if (!router || !router.length) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  // 匹配当前层级路由树
  const mathchs = matchRoutes(router, location);
  // 建议打个断点这里调一下，matchs是返回的层级路由
  // 第一个元素为根路由 最后一个元素为当前路由
  // 所以我们从前往后匹配
  const hasAuth = mathchs?.some((item) => {
    const route = item?.route;

    // 没有配置字段的直接返回
    if (!route) return false;
    // 返回是否需要登录
    return true;
  });

  if (!hasAuth) {
    return <Navigate to="/404" state={{ from: location.pathname }} />;
  }
  // if (isNeedLogin && !isLogin) {
  //   console.log("需要登录");
  //   // 跳转到登录  state保存源路由
  //   return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  // }

  // return children as React.ReactElement

  return <>{children}</>;
};
