import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Space,
  Table,
  PageHeader,
  DatePicker,
  Col,
  Row,
  Form,
  Select,
  Checkbox,
  Tooltip,
  Statistic,
  Tag,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { dealOverview } from "@Api/analyse_staff";
import { saleList } from "@Api/set_sale";
import BtnAuth from "@Shared/BtnAuth";

import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import { taskStatusColor } from "@Utils/data";

const { RangePicker } = DatePicker;
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
]);
function DealView({ clickCallback, clickCallback1, clickCallback2 }) {
  let navigate = useNavigate();
  const { id } = useParams();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [chartdata, setChartdata] = useState(null);
  const [pipeline, setPipeline] = useState([]); //销售流程
  const [chartVis, setChartVis] = useState(false);

  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    getPlpeline();
  }, []);

  useEffect(() => {
    if (pipeline.length > 0) {
      getPageData();
    }
  }, [pipeline]);

  useEffect(() => {
    if (pipeline.length > 0) {
      getPageData();
    }
  }, [
    pageMsg.pagination.current,
    pageMsg.pagination.pageSize,
    pageMsg?.order,
    pageMsg?.field,
  ]);

  //销售流程
  const getPlpeline = async () => {
    let { data } = await saleList();
    searchForm.setFieldValue("pipelineId", data[0]?.id);
    setPipeline(data);
  };

  // 查询
  const search = () => {
    // FIXME 第一页会不触发hooks,故分开
    if (pageMsg.pagination.current === 1) {
      getPageData();
    } else {
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          current: 1,
        },
      });
    }
  };
  const getPageData = () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    dealOverview({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      sort: pageMsg.order ? [`${pageMsg.field},${pageMsg.order}`] : undefined,
      data: {
        ...values,
        userId: id,
      },
    }).then((res) => {
      setData(res.data);
      setLoading(false);
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          total: res.additional_data.pagination.total,
        },
      });
      setChartdata(res.additional_data.count);
    });
  };

  const columns = [
    {
      title: "商机编号",
      dataIndex: "code",
      key: "code",
      fixed: "left",
      render: (value) => (
        <Space>
          <a>{value}</a>
        </Space>
      ),
      onCell: (record) => ({
        onClick: (event) => {
          clickCallback(record.title, record.id);
        },
      }),
    },
    {
      title: "商机名称",
      dataIndex: "title",
      width: "300",
      key: "title",
      fixed: "left",
      // ellipsis: {
      //   showTitle: false,
      // },
      // render: (title) => (
      //   <Tooltip placement="topLeft" title={title}>
      //     {title}
      //   </Tooltip>
      // ),
    },
    {
      title: "预算金额",
      dataIndex: "value",
      key: "value",
      sorter: true,
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "客户公司",
      dataIndex: "orgName",
      key: "orgName",
      sorter: true,
      width: 150,
      ellipsis: {
        showTitle: false,
      },

      render: (val, { orgId }) => {
        return (
          <Tooltip placement="topLeft" title={val}>
            <Space>
              <a>{val}</a>
            </Space>
          </Tooltip>
        );
      },
      onCell: (record) => ({
        onClick: (event) => {
          clickCallback1(record.orgName, record.orgId);
        },
      }),
    },
    {
      title: "最近跟进时间",
      dataIndex: "latestFollowUpTime",
      key: "latestFollowUpTime",
      sorter: true,
    },
    {
      title: "下一项工作计划",
      dataIndex: "nextActivity",
      key: "nextActivity",
      render: (value, record) => (
        <span style={value.isOver ? { color: "#fa4839" } : {}}>
          {value.value}
        </span>
      ),
    },
    {
      title: "客户联系人",
      dataIndex: "personName",
      key: "personName",
      render: (val) => {
        return (
          <Space>
            <a>{val}</a>
          </Space>
        );
      },
      onCell: (record) => ({
        onClick: (event) => {
          clickCallback2(record.personName, record.personId);
        },
      }),
    },
    {
      title: "销售流程阶段",
      dataIndex: "pipelineStageName",
      key: "pipelineStageName",
      sorter: true,
      width: 90,
    },
    {
      title: "此阶段停留(天)",
      dataIndex: "stayDays",
      key: "stayDays",
      sorter: true,
      width: 110,
      render: (value, record) => (
        <span style={value.isOver ? { color: "#fa4839" } : {}}>
          {value.value}
        </span>
      ),
    },
    {
      title: "商机状态",
      dataIndex: "statusName",
      key: "statusName",
      sorter: true,
      width: 100,
      render: (value, record) => (
        <Tag color={taskStatusColor[value]}>{value}</Tag>
      ),
    },
    {
      title: "销售人员",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
      sorter: true,
      width: 100,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      sorter: true,
      width: 120,
    },
  ];

  const gotoDealDetail = (id) => {
    navigate({
      pathname: "/pipeline",
      search: `?pipelineId=${id}`,
    });
  };
  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      order: Array.isArray(sorter) ? undefined : sorter.order,
      field: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  //echarts 配置
  const toolTipFun = (params) => {
    let html = `<div>${params[0].axisValue}</div>`;

    params.map((item) => {
      if (item.value || item.value === 0) {
        html += `<div>${item.marker} ${item.seriesName}：${item.value} 万元</div>`;
      }
    });
    return html;
  };
  const getOption = () => {
    let { numCount } = chartdata;
    let yData = [];
    let xData = [];
    numCount.forEach((ele) => {
      xData.unshift(ele.name);
      yData.unshift(ele.num);
    });

    const option = {
      title: {
        text: "商机数量统计",
        left: "center",
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      // legend: {
      //   data: ['2011年', '2012年']
      // },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "0%",
        containLabel: true,
      },

      xAxis: {
        // type: 'none',
        splitLine: {
          show: true,
          lineStyle: {
            type: "linner",
            color: "rgba(255,255,255,0.75)",
          },
        },
        minInterval: 1,
        axisLine: {
          //x轴颜色
          lineStyle: {
            // color: "#fff",
          },
        },
        axisTick: {
          show: false,
        },
        nameTextStyle: {
          color: "#000",
          fontSize: 1,
        },
        // boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: "category",
        axisTick: {
          show: false,
        },
        data: xData,
        axisLine: {
          //x轴颜色
          lineStyle: {
            // color: "#fff",
          },
        },
      },
      series: [
        {
          // name: 'wu',
          type: "bar",
          data: yData,
          label: {
            show: true,
            position: "outside",
            formatter: " {@score}笔",
          },
          itemStyle: {
            normal: {
              color: "#0B49B0",
            },
          },
        },
      ],
    };
    return option;
  };
  const getOption1 = () => {
    let { valueCount } = chartdata;
    let xData = [];
    let yData1 = [];
    let yData2 = [];
    valueCount.forEach((ele) => {
      xData.unshift(ele.name);
      yData1.unshift(ele.prev / 10000); //预测值
      yData2.unshift(ele.pv / 10000); //预算值
    });

    const option = {
      title: {
        text: "商机金额统计",
        left: "center",
        top: "0",
      },
      legend: {
        right: "center",
        top: "10%",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          return toolTipFun(params);
        },
      },
      grid: {
        left: "5%",
        right: "10%",
        bottom: "0%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        // max: 100,
      },
      yAxis: {
        type: "category",
        data: xData,
        axisLabel: {
          interval: 0,
          // rotate: 30,
        },
      },
      series: [
        {
          name: "预算金额",
          type: "bar",
          data: yData2,
          itemStyle: {
            normal: {
              color: "#DA4688",
            },
          },
          label: {
            show: true,
            position: "outside",
            formatter: " {@score}万元",
          },
          barMaxWidth: "20",
        },
        {
          name: "预测金额",
          barGap: 0,
          type: "bar",
          data: yData1,
          itemStyle: {
            normal: {
              color: "#1C47BF",
            },
          },
          label: {
            show: true,
            position: "outside",
            formatter: " {@score}万元",
          },
          barMaxWidth: "20",
        },
      ],
    };
    return option;
  };

  const handleChartChange = (e) => {
    setChartVis(e.target.checked);
  };

  const formItemChange = (changedValues, allValues) => {
    getPageData();
  };

  return (
    <div className="deal-page">
      <div className="search" style={{ marginBottom: "0px" }}>
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          onValuesChange={formItemChange}
          initialValues={{
            status: "1",
          }}
        >
          <Form.Item label="" name="status">
            <Select
              style={{ width: 180 }}
              options={[
                {
                  label: "全部",
                  value: "",
                },
                {
                  label: "进行中",
                  value: "1",
                },
                {
                  label: "赢单",
                  value: "2",
                },
                {
                  label: "输单",
                  value: "3",
                },
                {
                  label: "终止",
                  value: "4",
                },
              ]}
              placeholder="商机状态"
              // mode="multiple"
              // maxTagCount="responsive"
              // allowClear
            />
          </Form.Item>
          {/* <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item> */}
        </Form>
        {chartdata && (
          <div className="data-msg">
            商机: {chartdata.totalCount.total} 笔；
            <Tooltip title="预算：商机预算金额累加和">
              <span className="blue">预算</span>
            </Tooltip>
            :{" "}
            <Statistic
              value={chartdata.totalCount.pv}
              valueStyle={{ fontSize: "12px" }}
            />{" "}
            元；
            <Tooltip title="预测：商机预算金额加权和；权重由阶段机率、信心指数确定">
              <span className="blue"> 预测</span>
            </Tooltip>
            :{" "}
            <Statistic
              value={chartdata.totalCount.prev}
              valueStyle={{ fontSize: "12px" }}
            />{" "}
            元
          </div>
        )}
      </div>

      {chartdata && !chartVis && (
        <>
          <Row gutter={16}>
            <Col span={10} offset={1}>
              {Reflect.has(chartdata, "numCount") && (
                <ReactEChartsCore
                  echarts={echarts}
                  option={getOption()}
                  lazyUpdate={true}
                />
              )}
            </Col>
            <Col span={10} offset={3}>
              {Reflect.has(chartdata, "totalCount") && (
                <ReactEChartsCore
                  echarts={echarts}
                  option={getOption1()}
                  lazyUpdate={true}
                />
              )}
            </Col>
          </Row>
          <div style={{ marginBottom: "20px" }}></div>
        </>
      )}

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          ...pageMsg.pagination,
        }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        scroll={{
          x: (columns.length - 1) * 150,
        }}
      />
    </div>
  );
}

export default DealView;
