import React, { useState, useEffect, useContext } from "react";
import Box from "./Box";

import { funnelByDealNum } from "@Api/dashboard";

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
import { MyContext } from "../context";
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
]);

function Panel6({ params }) {
  return (
    <div>
      <Box title="商机数量">
        <div className="search"></div>
        <div>
          <BarCharet params={params}></BarCharet>
        </div>
      </Box>
    </div>
  );
}

export default Panel6;

function BarCharet({ params }) {
  const context = useContext(MyContext);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (context.timeBy) {
      getPageData();
    }
  }, [JSON.stringify(context)]);

  const getPageData = () => {
    const { userIdList } = context;
    funnelByDealNum({ userIdList, filterBy: 4 }).then((res) => {
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
        text: "",
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
            formatter: " {@score}个",
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
