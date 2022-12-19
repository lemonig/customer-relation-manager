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
import { store } from "./store/index";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

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
