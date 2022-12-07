import React from "react";
import ReactDOM from "react-dom/client";

import "./blank.css";
import "./index.css";
import "./styles/theme.less";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import { Provider } from "react-redux";
import store from "./store/index";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear"; // 导入插件
import "dayjs/locale/zh-cn"; // 导入本地化语言

dayjs.extend(isLeapYear); // 使用插件
dayjs.locale("zh-cn"); // 使用本地化语言

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals())
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
