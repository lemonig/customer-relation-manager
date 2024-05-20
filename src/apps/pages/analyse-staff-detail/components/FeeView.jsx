import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Table,
  Col,
  Row,
  Form,
  Select,
  Tooltip,
  Statistic,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  feeOverview,
  feeLineOverview,
  feePieOverview,
} from "@Api/analyse_staff";
import { dictList } from "@Api/public";

import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from "echarts/components";
import {
  CanvasRenderer,
  // SVGRenderer,
} from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);

function ContractView() {
  let navigate = useNavigate();
  const { id } = useParams();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [addData, setAddData] = useState(0);

  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [year, setYear] = useState(moment().year());
  const [dictData, setDictData] = useState({
    feeType: [], // 费用类型
    fromType: [], //数据来源
    expenseType: [], //报销类型
  });
  const [expenseType, setExpenseType] = useState([]);
  const [feeType, setFeeType] = useState([]);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize, year]);

  useEffect(() => {
    getDictData();
    getDictData1();
  }, []);
  // 查询
  const search = () => {
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
    if (values.feeTypeList) values.feeTypeList = [values.feeTypeList];
    if (values.expenseTypeList)
      values.expenseTypeList = [values.expenseTypeList];
    feeOverview({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        ...values,
        userId: id,
      },
    }).then((res) => {
      setData(res.data);
      setAddData(res.additional_data.total);

      setLoading(false);
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          total: res.additional_data.pagination.total,
        },
      });
    });
  };

  const getDictData = async () => {
    let { data } = await dictList({
      dictType: "fee_type",
    });
    setDictData({
      ...dictData,
      feeType: data,
    });
    setFeeType(data);
  };

  const getDictData1 = async () => {
    let { data } = await dictList({
      dictType: "expense_type",
    });
    setDictData({
      ...dictData,
      expenseType: data,
    });
    setExpenseType(data);
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
    // {
    //   title: "数据来源",
    //   dataIndex: "fromTypeName",
    //   key: "fromTypeName",
    // },
    {
      title: "费用报销单号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "报销类型",
      dataIndex: "expenseTypeName",
      key: "expenseTypeName",
    },

    {
      title: "费用类型",
      dataIndex: "feeTypeName",
      key: "feeTypeName",
    },

    // {
    //   title: "项目名称",
    //   dataIndex: "projectName",
    //   key: "projectName",
    // },
    // {
    //   title: "项目编码",
    //   dataIndex: "projectCode",
    //   key: "projectCode",
    // },
    // {
    //   title: "商机名称",
    //   dataIndex: "dealName",
    //   key: "dealName",
    // },
    // {
    //   title: "客户公司",
    //   dataIndex: "orgName",
    //   key: "orgName",
    // },

    // {
    //   title: "开始时间",
    //   dataIndex: "startTime",
    //   key: "startTime",
    // },
    // {
    //   title: "结束时间",
    //   dataIndex: "endTime",
    //   key: "endTime",
    // },
    {
      title: "报销金额",
      dataIndex: "feeValue",
      key: "feeValue",
      render: (feeValue, record) => (
        <Statistic value={feeValue} valueStyle={{ fontSize: "12px" }} />
      ),
    },
    {
      title: "报销人",
      dataIndex: "ownerUserName",
      key: "ownerUserName",
    },
    {
      title: "提交时间",
      dataIndex: "submitTime",
      key: "submitTime",
    },
  ];

  const gotoDealDetail = (id) => {
    navigate({
      pathname: "/pipeline",
      search: `?pipelineId=${id}`,
    });
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  const createYear = () => {
    let year = moment().year();
    return Array.from({ length: 3 }, (_, i) => ({
      label: year - i + "年",
      value: year - i,
    }));
  };

  const formItemChange = (changedValues, allValues) => {
    getPageData();
  };

  return (
    <div className="deal-page">
      <div className="search" style={{ marginBottom: "0px" }}>
        <Space>
          <Form
            layout="inline"
            form={searchForm}
            onFinish={search}
            initialValues={{
              year: moment().year(),
            }}
            onValuesChange={formItemChange}
          >
            <Form.Item label="" name="year">
              <Select style={{ width: 120 }} options={createYear()} />
            </Form.Item>
            <Form.Item label="" name="expenseTypeList">
              <Select
                style={{ width: 200 }}
                placeholder="报销类型"
                options={expenseType}
                allowClear
                fieldNames={{ label: "dictLabel", value: "dictValue" }}
                // mode="multiple"
                // maxTagCount="responsive"
              />
            </Form.Item>
            <Form.Item label="" name="feeTypeList">
              <Select
                style={{ width: 200 }}
                placeholder="费用类型"
                options={feeType}
                allowClear
                fieldNames={{ label: "dictLabel", value: "dictValue" }}
                // mode="multiple"
                // maxTagCount="responsive"
              />
            </Form.Item>
          </Form>
        </Space>
        {addData != null ? (
          <div className="data-msg">
            总计：
            <Statistic value={addData} valueStyle={{ fontSize: "12px" }} />元
          </div>
        ) : null}
      </div>

      <Row gutter={16}>
        <Col span={10} offset={1}>
          <BarCharet
            params={{
              year,
              userId: id,
            }}
          ></BarCharet>
        </Col>
        <Col span={10} offset={3}>
          <PieChart
            params={{
              year,
              userId: id,
            }}
          ></PieChart>
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
    </div>
  );
}

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

function BarCharet({ params }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (params.userId) {
      getPageData();
    }
  }, [params.year]);
  const getOption = () => {
    if (!data.length) {
      return {
        title: {
          text: "暂无数据",
          left: "center",
        },
      };
    }
    return {
      legend: {
        top: "5%",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}:<br/>{c}￥",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.label),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: data.map((item) => item.value),
          type: "bar",
        },
      ],
    };
  };

  const getPageData = () => {
    feeLineOverview({ ...params }).then((res) => {
      setData(res.data);
    });
  };
  return !!data ? (
    <ReactEChartsCore
      echarts={echarts}
      option={getOption()}
      lazyUpdate={true}
    />
  ) : null;
}

function PieChart({ params }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (params.userId) {
      getPageData();
    }
  }, [params.year]);
  const getOption1 = () => {
    if (!data.length) {
      return {
        title: {
          text: "暂无数据",
          left: "center",
        },
      };
    }
    return {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}:<br/>{c}￥",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: data.map((i) => ({
            ...i,
            name: i.label,
          })),
          label: {
            formatter: "{name|{b}}{d}% ",
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: "#999",
              },
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  };

  const getPageData = () => {
    feePieOverview({ ...params }).then((res) => {
      setData(res.data);
    });
  };

  return !!data ? (
    <ReactEChartsCore
      echarts={echarts}
      option={getOption1()}
      lazyUpdate={true}
    />
  ) : null;
}

export default ContractView;
