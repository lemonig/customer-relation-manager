import React, { useState, useEffect } from "react";
import Box from "./Box";

import { chartByContractValue } from "@Api/dashboard";

import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
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
  LegendComponent,
]);

function Panel3({ params }) {
  return (
    <div>
      <Box title="合同金额">
        <div className="search"></div>
        <div>
          <BarCharet params={params}></BarCharet>
        </div>
      </Box>
    </div>
  );
}

export default Panel3;

function BarCharet({ params }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (params.filterBy && params.timeBy) {
      getPageData();
    }
  }, [params.timeBy, params.filterBy]);

  const getPageData = () => {
    chartByContractValue({ ...params }).then((res) => {
      setData(res.data);
    });
  };

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
      title: {
        text: "合同额",
        left: "center",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}:<br/>{c}万￥",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.name),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: data.map((item) => item.value),
          type: "bar",
          label: {
            show: true,
            position: "outside",
            formatter: " {@score}万",
          },
          itemStyle: {
            normal: {
              color: "#0B49B0",
            },
          },
        },
      ],
    };
  };

  return !!data ? (
    <ReactEChartsCore
      echarts={echarts}
      option={getOption()}
      lazyUpdate={true}
    />
  ) : null;
}
