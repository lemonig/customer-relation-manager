/*
 * @Author: Jonny
 * @Date: 2022-11-01 13:57:05
 * @LastEditors: Jonny
 * @LastEditTime: 2024-08-29 10:18:59
 * @FilePath: \grean-crm\src\setupProxy.js
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // 指定需要转发的请求
    createProxyMiddleware({
      target: "http://192.168.168.9:15456", //服务器的地址
      // target: "http://127.0.0.1:8890", //mock
      // target: "https://portal.greandata.com:1456/", //服务器的地址
      changeOrigin: true,
      // pathRewrite(path) {
      //   return path.replace("/api", "");
      // },
    })
  );
};
