import React, { useState, useEffect } from "react";
import Box from "./Box";

import { funnelByDealValue } from "@Api/dashboard";

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

function Panel4({ params }) {
  return (
    <div>
      <Box title="商机统计">
        <div className="search"></div>
        <div>
          <BarCharet params={params}></BarCharet>
        </div>
      </Box>
    </div>
  );
}

export default Panel4;

function BarCharet({ params }) {
  console.log(params);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (params.filterBy && params.timeBy) {
      getPageData();
    }
  }, [params.timeBy, params.filterBy]);

  const getPageData = () => {
    funnelByDealValue({ ...params }).then((res) => {
      console.log(res);
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
    const option = {
      title: {
        text: "商机金额",
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
        data: data.map((item) => item.name),
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
          data: data.map((item) => item.value),
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
    return option;
  };

  return !!data ? (
    <ReactEChartsCore
      echarts={echarts}
      option={getOption()}
      lazyUpdate={true}
    />
  ) : null;
}
