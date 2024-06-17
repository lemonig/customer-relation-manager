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
      if (res.success) {
        setData(res.data);
      }
    });
  };

  return (
    <Descriptions title="">
      <Descriptions.Item label="姓名">{data.name}</Descriptions.Item>
      <Descriptions.Item label="性别">
        {data.gender ? "男" : " 女"}
      </Descriptions.Item>
      <Descriptions.Item label="联系电话" span={2}>
        {data.phone}
      </Descriptions.Item>
      <Descriptions.Item label="客户">{data.orgName}</Descriptions.Item>
      <Descriptions.Item label="部门">{data.department}</Descriptions.Item>
      <Descriptions.Item label="职位">{data.jobTitle}</Descriptions.Item>
      <Descriptions.Item label="关键决策人">
        {data.isKdm ? "是" : "否"}
      </Descriptions.Item>
      <Descriptions.Item label="办公地址">
        {data.officeAddress}
      </Descriptions.Item>
      <Descriptions.Item label="家庭地址">{data.address}</Descriptions.Item>
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
