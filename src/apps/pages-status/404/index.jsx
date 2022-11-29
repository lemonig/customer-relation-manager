import { Button, Result } from "antd";
import React from "react";
const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起, 您访问的页面不存在."
    extra={<Button type="primary">返回首页</Button>}
  />
);
export default NotFound;
