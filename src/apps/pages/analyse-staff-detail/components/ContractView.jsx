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
  contractOverview,
  contractLineOverview,
  contractPieOverview,
} from "@Api/analyse_staff";

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
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [year, setYear] = useState(moment().year());

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize, year]);

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
    contractOverview({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        year,
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
      title: "合同名称",
      dataIndex: "name",
      key: "name",
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },

    {
      title: "合同编号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },

    {
      title: "金额",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Statistic value={value} valueStyle={{ fontSize: "12px" }} />
      ),
    },

    {
      title: "签订日期",
      dataIndex: "signedDate",
      key: "signedDate",
    },
    {
      title: "客户",
      dataIndex: "orgName",
      key: "orgName",
      ellipsis: {
        showTitle: false,
      },
      render: (orgName) => (
        <Tooltip placement="topLeft" title={orgName}>
          {orgName}
        </Tooltip>
      ),
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

  return (
    <div className="deal-page">
      <div className="search" style={{ marginBottom: "0px" }}>
        <Space>
          <Select
            style={{ width: 120 }}
            options={createYear()}
            placeholder="商机状态"
            value={year}
            onChange={(v) => setYear(v)}
          />
          {/* <Button type="primary" onClick={search}>
            查询
          </Button> */}
        </Space>
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
    contractLineOverview({ ...params }).then((res) => {
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
    console.log(params);
    contractPieOverview({ ...params }).then((res) => {
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
