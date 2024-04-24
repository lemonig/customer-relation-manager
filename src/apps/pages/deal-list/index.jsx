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
  TreeSelect,
} from "antd";
import { useNavigate, useResolvedPath } from "react-router-dom";
import moment from "moment";
import { dealPage } from "@Api/deal_list";
import { saleList } from "@Api/set_sale";
import { salesmanList } from "@Api/set_user";
import { deptList as deptListApi } from "@Api/set_dept.js";
import DealForm from "./Form/DealForm";
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
import { arrayToTree } from "@Utils/util";
import { useDispatch, useSelector } from "react-redux";
import { SAVE_FORM, DELETE_FORM } from "@Store/features/searchFormSlice.js";
import "./index.less";

const { RangePicker } = DatePicker;
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
]);
function DealList() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [chartdata, setChartdata] = useState(null);
  const [salerList, setSalerList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [chartVis, setChartVis] = useState(false);

  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let resolvedPath = useResolvedPath();
  const { form: preForm } = useSelector((state) => state.searchForm);
  console.log(preForm);

  useEffect(() => {
    getSalesmanList();
    getDeptList();
  }, []);

  useEffect(() => {
    console.log("get");
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  // useEffect(() => {
  //   const unlisten = navigate.listen((location, action) => {
  //     if (action === "POP") {
  //       console.log("back");
  //       console.log(preForm);
  //     }
  //   });

  //   return () => {
  //     unlisten();
  //   };
  // }, [resolvedPath.patb]);

  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };
  //部门
  const getDeptList = async () => {
    let { data } = await deptListApi();
    let res = arrayToTree(data);
    setDeptList(res);
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
    if (values.deptIdList) values.deptIdList = [values.deptIdList];
    if (values.userIdList) values.userIdList = [values.userIdList];
    if (values.valueList) values.valueList = values.valueList.split(",");
    values.pipelineId = 1;
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
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
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
      title: "预计金额",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
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
    },
    // {
    //   title: "竞争对手(个)",
    //   dataIndex: "competitorNum",
    //   key: "competitorNum",
    // },
    // {
    //   title: "销售流程",
    //   dataIndex: "pipelineName",
    //   key: "pipelineName",
    // },
    {
      title: "销售流程阶段",
      dataIndex: "pipelineStageName",
      key: "pipelineStageName",
    },
    {
      title: "此阶段停留(天)",
      dataIndex: "stayDays",
      key: "stayDays",
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
    },
    {
      title: "销售人员",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];

  const gotoDealDetail = (id) => {
    console.log(searchForm);
    let values = searchForm.getFieldsValue();
    console.log(values);
    dispatch(SAVE_FORM(values));

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
      xData.unshift(ele.name);
      yData.unshift(ele.num);
    });

    const option = {
      title: {
        text: "商机数量统计",
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
      yData2.unshift(ele.pv / 10000); //预计值
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

  return (
    <div className="deal-page">
      <PageHeader className="site-page-header" title="商机列表" />
      <div className="search" style={{ marginBottom: "0px" }}>
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

          <Form.Item label="" name="deptIdList">
            <TreeSelect
              style={{ width: "180px" }}
              fieldNames={{
                label: "label",
                value: "key",
              }}
              treeData={deptList}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="选择部门"
              allowClear
              treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item label="" name="userIdList">
            <Select
              style={{ width: 120 }}
              options={salerList}
              placeholder="销售人员"
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
                  label: "1000万以上",
                  value: "10000000",
                },
                {
                  label: "500~1000万",
                  value: "5000000,10000000",
                },
                {
                  label: "100~500万",
                  value: "1000000,5000000",
                },
                {
                  label: "0~100万",
                  value: "0,1000000",
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
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <BtnAuth word="deal:create">
              <Button onClick={handleAdd}>新建</Button>
            </BtnAuth>
          </Form.Item>
        </Form>
        <Checkbox onChange={handleChartChange}>隐藏统计</Checkbox>
      </div>
      {chartdata && (
        <div className="data-msg">
          商机: {chartdata.totalCount.total} 笔；
          <Tooltip title="预计：商机预计金额累加和">
            <span className="blue">预计</span>
          </Tooltip>
          :{" "}
          <Statistic
            value={chartdata.totalCount.pv}
            valueStyle={{ fontSize: "12px" }}
          />{" "}
          元；
          <Tooltip title="预测：商机预计金额加权和；权重由阶段机率、信心指数确定">
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
      {/* 表单 */}
      {isModalOpen && (
        <DealForm isModalOpen={isModalOpen} closeModal={closeModal} />
      )}
    </div>
  );
}

export default DealList;
