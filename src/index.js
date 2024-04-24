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


if (process.env.NODE_ENV === 'production') {
  const BrowserLogger = require('alife-logger');
  const __bl = BrowserLogger.singleton({ pid: "e2247z4cy8@dd7bc0190969049", appType: "web", imgUrl: "https://arms-retcode.aliyuncs.com/r.png?", sendResource: true, enableLinkTrace: true, behavior: true });
}



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
