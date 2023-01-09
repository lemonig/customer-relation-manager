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
} from "antd";
import { workreportDetail, workreportExport } from "@Api/work_report";

// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";

function WorkReportDetail() {
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
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "商机名称",
      key: "dealName",
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.deal.name}>
          <a onClick={() => gotoDealDetail(record.deal.id)}>
            {record.deal.name}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "参与人员",
      dataIndex: "participantName",
      key: "participantName",
    },
    {
      title: "任务描述",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
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

  const downloadPage = async () => {
    await workreportExport(
      {
        id: workId,
      },
      data.name
    );

    // html2canvas(document.getElementById("report_del_cont"), {
    //   allowTaint: true,
    // }).then(function (canvas) {
    //   var contentWidth = canvas.width;
    //   var contentHeight = canvas.height;

    //   //一页pdf显示html页面生成的canvas高度;
    //   var pageHeight = (contentWidth / 592.28) * 841.89;
    //   //未生成pdf的html页面高度
    //   var leftHeight = contentHeight;
    //   //pdf页面偏移
    //   var position = 0;
    //   //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
    //   var imgWidth = 595.28;
    //   var imgHeight = (592.28 / contentWidth) * contentHeight;

    //   var pageData = canvas.toDataURL("image/jpeg", 1.0);
    //   var pdf = new jsPDF("l", "pt", "a4");
    //   if (leftHeight < pageHeight) {
    //     pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
    //   } else {
    //     while (leftHeight > 0) {
    //       pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
    //       leftHeight -= pageHeight;
    //       position -= 841.89;
    //       //避免添加空白页
    //       if (leftHeight > 0) {
    //         pdf.addPage();
    //       }
    //     }
    //   }
    //   pdf.save("content.pdf");
    // });
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        style={{ padding: "0 24px" }}
        onBack={() =>
          navigate({
            pathname: "/workReport",
            replace: true,
          })
        }
        title="工作报告详情"
        extra={[
          <Button key="3" type="link" onClick={downloadPage}>
            下载
          </Button>,
        ]}
      />
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
          <Descriptions title="" column={1}>
            <Descriptions.Item label="报告编号">{data.code}</Descriptions.Item>
            <Descriptions.Item label="报告链接">
              <a
                href={data.url}
                download={data.name}
                target="_blank"
                rel="noreferrer"
              >
                {data.name}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="销售人员">
              {data.userOwnerName}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {data.createTime}
            </Descriptions.Item>
            <Descriptions.Item label="报告明细"></Descriptions.Item>
          </Descriptions>
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

export default WorkReportDetail;
