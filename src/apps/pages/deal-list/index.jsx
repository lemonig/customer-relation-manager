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
} from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { dealPage } from "@Api/deal_list";
import { saleList } from "@Api/set_sale";
import { salesmanList } from "@Api/set_user";
import { deptList as deptListApi } from "@Api/set_dept.js";
import DealForm from "./Form/DealForm";

import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  // GridSimpleComponent,
  GridComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  // ToolboxComponent,
  TooltipComponent,
  // AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  // MarkAreaComponent,
  // LegendComponent,
  // LegendScrollComponent,
  // LegendPlainComponent,
  // DataZoomComponent,
  // DataZoomInsideComponent,
  // DataZoomSliderComponent,
  // VisualMapComponent,
  // VisualMapContinuousComponent,
  // VisualMapPiecewiseComponent,
  // AriaComponent,
  // TransformComponent,
  // DatasetComponent,
} from "echarts/components";
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
  CanvasRenderer,
  // SVGRenderer,
} from "echarts/renderers";

import "./index.less";
const { RangePicker } = DatePicker;
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);
function DealList() {
  let navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [chartdata, setChartdata] = useState(null);
  const [pipeline, setPipeline] = useState([]); //????????????
  const [salerList, setSalerList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [chartVis, setChartVis] = useState(false);

  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  useEffect(() => {
    getPlpeline();
    getSalesmanList();
    getDeptList();
  }, []);

  useEffect(() => {
    if (pipeline.length > 0) {
      getPageData();
    }
  }, [JSON.stringify(pageMsg), pipeline]);

  //????????????
  const getPlpeline = async () => {
    let { data } = await saleList();
    searchForm.setFieldValue("pipelineId", data[0]?.id);
    setPipeline(data);
  };
  //????????????
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };
  //??????
  const getDeptList = async () => {
    let { data } = await deptListApi();
    setDeptList(data);
  };

  // ??????
  const search = () => {
    // FIXME ?????????????????????hooks,?????????
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
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYYMMDD");
      values.endTime = moment(values.time[1]).format("YYYYMMDD");
    }
    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    if (values.userIdList) values.userIdList = [values.userIdList];
    if (values.valueList) values.valueList = values.valueList.split(",");

    dealPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
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
      title: "??????",
      key: "index",
      width: 60,
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
    },

    {
      title: "????????????",
      dataIndex: "code",
      key: "code",
      render: (value, record) => (
        <Space>
          <a>{value}</a>
        </Space>
      ),
      onCell: (record) => ({
        onClick: (event) => {
          gotoDealDetail(record.id);
        },
      }),
    },
    {
      title: "????????????",
      dataIndex: "title",
      width: "300",
      key: "title",
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
      title: "????????????",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "????????????",
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: "??????????????????",
      dataIndex: "latestFollowUpTime",
      key: "latestFollowUpTime",
    },
    {
      title: "?????????????????????",
      dataIndex: "nextActivity",
      key: "nextActivity",
      render: (value, record) => (
        <span style={value.isOver ? { color: "#fa4839" } : {}}>
          {value.value}
        </span>
      ),
    },
    {
      title: "???????????????",
      dataIndex: "personName",
      key: "personName",
    },
    {
      title: "????????????(???)",
      dataIndex: "competitorNum",
      key: "competitorNum",
    },
    // {
    //   title: "????????????",
    //   dataIndex: "pipelineName",
    //   key: "pipelineName",
    // },
    {
      title: "??????????????????",
      dataIndex: "pipelineStageName",
      key: "pipelineStageName",
    },
    {
      title: "???????????????(???)",
      dataIndex: "stayDays",
      key: "stayDays",
      render: (value, record) => (
        <span style={value.isOver ? { color: "#fa4839" } : {}}>
          {value.value}
        </span>
      ),
    },
    {
      title: "????????????",
      dataIndex: "statusName",
      key: "statusName",
    },
    {
      title: "????????????",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },
    {
      title: "????????????",
      dataIndex: "createTime",
      key: "createTime",
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
      ...sorter,
    });
  };

  // ??????
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const closeModal = (flag) => {
    // flag ??????????????????
    setIsModalOpen(false);
    if (flag) getPageData();
  };
  //echarts ??????
  const toolTipFun = (params) => {
    let html = `<div>${params[0].axisValue}</div>`;

    params.map((item) => {
      if (item.value || item.value === 0) {
        html += `<div>${item.marker} ${item.seriesName}???${item.value} ??????</div>`;
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
        text: "??????????????????",
        left: "center",
      },
      legend: {},
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      // legend: {
      //   data: ['2011???', '2012???']
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
          //x?????????
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
          //x?????????
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
            formatter: " {@score}???",
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
      yData1.unshift(ele.prev / 10000); //?????????
      yData2.unshift(ele.pv / 10000); //?????????
    });

    const option = {
      title: {
        text: "??????????????????",
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
          name: "????????????",
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
            formatter: " {@score}??????",
          },
          barMaxWidth: "20",
        },
        {
          name: "????????????",
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
            formatter: " {@score}??????",
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

  return (
    <div className="deal-page">
      <PageHeader className="site-page-header" title="????????????" />
      <div className="search" style={{ marginBottom: "0px" }}>
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="name">
            <Input
              placeholder="???????????????????????????????????????????????????"
              style={{ width: 240 }}
              // value={searchVal}
            />
          </Form.Item>
          <Form.Item label="" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item label="" name="pipelineId">
            <Select
              style={{ width: 120 }}
              placeholder="????????????"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              options={pipeline}
            />
          </Form.Item>
          <Form.Item label="" name="deptIdList">
            <Select
              style={{ width: 120 }}
              options={deptList}
              placeholder="????????????"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
            />
          </Form.Item>
          <Form.Item label="" name="userIdList">
            <Select
              style={{ width: 120 }}
              options={salerList}
              placeholder="????????????"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
            />
          </Form.Item>
          <Form.Item label="" name="valueList">
            <Select
              style={{ width: 120 }}
              options={[
                {
                  label: "1000?????????",
                  value: "10000000",
                },
                {
                  label: "500~1000???",
                  value: "5000000,10000000",
                },
                {
                  label: "100~500???",
                  value: "1000000,5000000",
                },
                {
                  label: "0~100???",
                  value: "0,1000000",
                },
              ]}
              placeholder="????????????"
              allowClear
            />
          </Form.Item>
          <Form.Item label="" name="statusList">
            <Select
              style={{ width: 120 }}
              options={[
                {
                  label: "?????????",
                  value: "1",
                },
                {
                  label: "??????",
                  value: "2",
                },
                {
                  label: "??????",
                  value: "3",
                },
                {
                  label: "??????",
                  value: "4",
                },
              ]}
              placeholder="????????????"
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              ??????
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleAdd}>??????</Button>
          </Form.Item>
        </Form>
        <Checkbox onChange={handleChartChange}>????????????</Checkbox>
      </div>
      {chartdata && (
        <div className="data-msg">
          ??????: {chartdata.totalCount.total} ??????
          <Tooltip title="????????????????????????????????????">
            <span className="blue">??????</span>
          </Tooltip>
          :{" "}
          <Statistic
            value={chartdata.totalCount.pv}
            valueStyle={{ fontSize: "12px" }}
          />{" "}
          ??????
          <Tooltip title="?????????????????????????????????????????????????????????????????????????????????">
            <span className="blue"> ??????</span>
          </Tooltip>
          :{" "}
          <Statistic
            value={chartdata.totalCount.prev}
            valueStyle={{ fontSize: "12px" }}
          />{" "}
          ???
        </div>
      )}
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
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
      {/* ?????? */}
      {isModalOpen && (
        <DealForm isModalOpen={isModalOpen} closeModal={closeModal} />
      )}
    </div>
  );
}

export default DealList;
