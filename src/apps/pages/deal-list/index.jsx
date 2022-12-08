import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Space,
  Table,
  Modal,
  message,
  PageHeader,
  DatePicker,
  Col,
  Row,
  Form,
  Select,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  dealPage,
  dealSingleGet,
  dealList,
  dealadd,
  dealUpdate,
  dealCodeGet,
  dealChart,
  dealExport,
} from "@Api/deal_list";
import { saleList } from "@Api/set_sale";
import IconFont from "@Components/IconFont";
import EChartsReact from "echarts-for-react";
import DealForm from "./Form/DealForm";

import "./index.less";
const { RangePicker } = DatePicker;

function DealList() {
  let navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [chartdata, setChartdata] = useState({});
  const [pipeline, setPipeline] = useState([]); //销售流程

  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  useEffect(() => {
    //销售流程
    const getPlpeline = async () => {
      let { data } = await saleList();
      setPipeline(data);
    };
    getPlpeline();
  }, []);
  useEffect(() => {
    getPageData();
    JSON.stringify(pageMsg);
  }, [JSON.stringify(pageMsg)]);
  const showModal = () => {
    setIsModalOpen(true);
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
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYYMMDD");
      values.endTime = moment(values.time[1]).format("YYYYMMDD");
    }
    console.log(values);
    if (values.valueList) {
      values.valueList = values.valueList.split(",");
    }

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
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) => index + 1,
    },

    {
      title: "商机编号",
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
      title: "商机名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "预计金额",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "客户公司",
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: "最近跟进时间",
      dataIndex: "latestFollowUpTime",
      key: "latestFollowUpTime",
    },
    {
      title: "下一项工作计划",
      dataIndex: "nextActivityName",
      key: "dealProbability",
    },
    {
      title: "客户联系人",
      dataIndex: "personName",
      key: "personName",
    },
    {
      title: "竞争对手(个)",
      dataIndex: "competitorNum",
      key: "competitorNum",
    },
    {
      title: "销售流程",
      dataIndex: "pipelineName",
      key: "pipelineName",
    },
    {
      title: "销售流程阶段",
      dataIndex: "pipelineStageName",
      key: "pipelineStageName",
    },
    {
      title: "此阶段停留(天)",
      dataIndex: "stayDays",
      key: "stayDays",
    },
    {
      title: "商机状态(天)",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "创建时间",
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

  // 新建
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
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
      xData.push(ele.name);
      yData.push(ele.num);
    });

    const option = {
      title: {
        text: "商品数量统计",
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
            color: "rgba(255,255,255,0.15)",
          },
        },
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
      xData.push(ele.name);
      yData1.push(ele.prev / 10000); //预测值
      yData2.push(ele.pv / 10000); //预计值
    });

    const option = {
      title: {
        text: "商机金额统计",
        left: "center",
        top: "0",
      },
      legend: {
        right: "center",
        top: "7%",
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
        {
          name: "预计金额",
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
      ],
    };
    return option;
  };

  return (
    <div className="deal-page">
      <PageHeader className="site-page-header" title="商机列表" />
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="name">
            <Input
              placeholder="请输入商机名称、商机编号、客户公司"
              style={{ width: 240 }}
              // value={searchVal}
            />
          </Form.Item>
          <Form.Item label="" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item label="" name="pipelineId">
            <Select
              placeholder="销售流程"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              options={pipeline}
            />
          </Form.Item>
          <Form.Item label="" name="deparment">
            <Select
              style={{ width: 120 }}
              options={[
                {
                  label: "1",
                  value: "1",
                },
              ]}
              placeholder="选择部门"
              allowClear
            />
          </Form.Item>
          <Form.Item label="" name="staff">
            <Select
              style={{ width: 120 }}
              options={[
                {
                  label: "1",
                  value: "1",
                },
              ]}
              placeholder="销售人员"
              allowClear
            />
          </Form.Item>
          <Form.Item label="" name="valueList">
            <Select
              style={{ width: 120 }}
              options={[
                {
                  label: "1000万以上",
                  value: "1000",
                },
                {
                  label: "500~1000万",
                  value: "500,1000",
                },
                {
                  label: "100~500万",
                  value: "100,500",
                },
                {
                  label: "0~100万",
                  value: "0,100",
                },
              ]}
              placeholder="预计金额"
              allowClear
            />
          </Form.Item>
          <Form.Item label="" name="statusList">
            <Select
              style={{ width: 120 }}
              options={[
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
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleAdd}>新建</Button>
          </Form.Item>
        </Form>
      </div>
      <Row gutter={16}>
        <Col span={10} offset={1}>
          {Reflect.has(chartdata, "numCount") && (
            <EChartsReact option={getOption()} lazyUpdate={true} />
          )}
        </Col>
        <Col span={10} offset={3}>
          {Reflect.has(chartdata, "totalCount") && (
            <EChartsReact option={getOption1()} lazyUpdate={true} />
          )}
        </Col>
      </Row>
      <div style={{ marginBottom: "20px" }}></div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
      {/* 表单 */}
      <DealForm isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default DealList;
