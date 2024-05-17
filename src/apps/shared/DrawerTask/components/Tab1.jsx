import React, { useState, useEffect, useContext } from "react";
import { actGet } from "@Api/act_adm";
import { Descriptions, Image } from "antd";
import { TaskContext } from "../index";

const Tab1 = () => {
  const id = useContext(TaskContext);
  const [data, setData] = useState({});

  useEffect(() => {
    getPageData();
  }, []);
  const getPageData = () => {
    actGet({
      id,
    }).then((res) => {
      setData(res.data);
    });
  };

  return (
    <Descriptions title="User Info">
      <Descriptions.Item label="任务状态">{data.statusName}</Descriptions.Item>
      <Descriptions.Item label="任务类型" span={2}>
        {data.typeName}
      </Descriptions.Item>
      <Descriptions.Item label="任务标题">{data.subject}</Descriptions.Item>
      <Descriptions.Item label="开始日期">{data.startTime}</Descriptions.Item>
      <Descriptions.Item label="结束日期">{data.endTime}</Descriptions.Item>
      <Descriptions.Item label="关联商机">{data.dealName}</Descriptions.Item>
      <Descriptions.Item label="关联客户">{data.orgName}</Descriptions.Item>
      <Descriptions.Item label="联系人">{data.personName}</Descriptions.Item>
      <Descriptions.Item label="其他参与人">
        {data.participant}
      </Descriptions.Item>
      <Descriptions.Item label="地点" span={2}>
        {data.address}
      </Descriptions.Item>
      <Descriptions.Item label="实际费用">{data.fee}</Descriptions.Item>
      <Descriptions.Item label="完成纪要" span={3}>
        {data.description}
      </Descriptions.Item>
      <Descriptions.Item label="创建人">
        {data.createUserName}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
      <Descriptions.Item label="完成时间">{data.doneTime}</Descriptions.Item>
      <Descriptions.Item label="OA推送状态" span={3}>
        {data.isSync}
      </Descriptions.Item>
      <Descriptions.Item label="照片" span={3}>
        {data.fileList?.map((item) => (
          <Image key={item.id} width={150} src={item.url} />
        ))}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default Tab1;
