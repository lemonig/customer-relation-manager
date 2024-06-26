import React, { useEffect, useState, useRef } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Card,
  Button,
  Descriptions,
  PageHeader,
  message,
  Table,
  Tooltip,
  Statistic,
} from "antd";
import { workreportDetail, workreportExport } from "@Api/work_report";

function WorkReportDownload() {
  let navigate = useNavigate();
  const [getParams, setParam] = useSearchParams();
  const workId = getParams.getAll("workId")[0];
  const copntentElement = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    getPageData();
  }, []);
  const getPageData = async () => {
    let { data } = await workreportDetail({
      id: workId,
    });
    setData(data);
  };

  const gotoDealDetail = (id) => {
    navigate({
      pathname: "/pipeline",
      search: `?pipelineId=${id}`,
    });
  };
  const columns = [
    {
      title: "任务编号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "任务类型",
      dataIndex: "typeName",
      key: "typeName",
    },
    // {
    //   title: "任务主题",
    //   dataIndex: "subject",
    //   key: "subject",
    // },
    {
      title: "客户联系人",
      dataIndex: "personName",
      key: "personName",
    },
    {
      title: "任务开始时间",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "任务完成时间",
      dataIndex: "doneTime",
      key: "doneTime",
    },
    {
      title: "商机名称",
      key: "dealName",

      render: (_, record) => (
        <Button type="link" onClick={() => gotoDealDetail(record.deal.id)}>
          {record.deal.name}
        </Button>
      ),
    },
    {
      title: "参与人员",
      dataIndex: "participantName",
      key: "participantName",
    },
    {
      title: "任务描述",
      dataIndex: "subject",
      key: "subject",
      ellipsis: {
        showTitle: false,
      },
      render: (subject) => (
        <Tooltip placement="topLeft" title={subject}>
          {subject}
        </Tooltip>
      ),
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      {data ? (
        <Card
          // title="客户公司"
          bordered={false}
          className="l-card card-margin"
          headStyle={{
            fontSize: "12px",
            color: "#721ea9",
            fontWeight: 600,
          }}
          id="report_del_cont"
          ref={copntentElement}
        >
          {/* 基本信息 */}
          <div style={{ width: "100%" }}>
            <Descriptions title="" column={4}>
              <Descriptions.Item label="报告编号" span={4}>
                {data.code}
              </Descriptions.Item>
              <Descriptions.Item label="报告链接" span={4}>
                <a
                  href={data.url}
                  download={data.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.name}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="销售人员" span={4}>
                {data.userOwnerName}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={4}>
                {data.createTime}
              </Descriptions.Item>
              <Descriptions.Item label={`${data.year}年合同额`}>
                <Statistic
                  value={data.contractValu}
                  valueStyle={{ fontSize: "12px" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="报销额度">
                <Statistic
                  value={data.valueRate}
                  valueStyle={{ fontSize: "12px" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="控制金额">
                <Statistic
                  value={data.controlValue}
                  valueStyle={{ fontSize: "12px" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="已报销金额">
                <Statistic
                  value={data.receivedValue}
                  valueStyle={{ fontSize: "12px" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="报告明细" span={4}></Descriptions.Item>
            </Descriptions>
          </div>
          <Table
            dataSource={data.activityVoList}
            columns={columns}
            pagination={false}
          />
        </Card>
      ) : null}
    </div>
  );
}

export default WorkReportDownload;
