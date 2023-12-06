import { Button, Result } from "antd";
import React from "react";

const back = () => {
  window.location.history.back();
};
const NotAuth = () => (
  <Result
    status="401"
    title="401"
    subTitle="对不起, 您访问的页面无权限."
    extra={
      <Button type="primary" onClick={back}>
        返回首页
      </Button>
    }
  />
);
export default NotAuth;
