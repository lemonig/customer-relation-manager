import React, { useState, useEffect, useContext } from "react";
import { customerGet } from "@Api/info_customer";
import { Descriptions, Image } from "antd";
import { Context } from "../index";

const Tab1 = () => {
  const id = useContext(Context);
  const [data, setData] = useState({});

  useEffect(() => {
    getPageData();
  }, []);
  const getPageData = () => {
    customerGet({
      id,
    }).then((res) => {
      setData(res.data);
    });
  };

  return (
    <Descriptions title="">
      <Descriptions.Item label="客户名称">{data.name}</Descriptions.Item>
      <Descriptions.Item label="省份">{data.gender}</Descriptions.Item>
      <Descriptions.Item label="统一社会信用代码" span={2}>
        {data.phone}
      </Descriptions.Item>
      <Descriptions.Item label="地址">{data.orgName}</Descriptions.Item>
      <Descriptions.Item label="备注">{data.description}</Descriptions.Item>
      <Descriptions.Item label="创建时间" span={2}>
        {data.createTime}
      </Descriptions.Item>
      <Descriptions.Item label="创建人">
        {data.createUserName}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default Tab1;
