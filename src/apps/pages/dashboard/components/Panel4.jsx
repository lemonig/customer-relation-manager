import React, { useState, useEffect, useContext } from "react";
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
import { CanvasRenderer } from "echarts/renderers";
import { MyContext } from "../context";
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
      <Box title="商机金额">
        <div className="search"></div>
        <div>
          <BarCharet params={params}></BarCharet>
        </div>
      </Box>
    </div>
  );
}

export default Panel4;
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
  const context = useContext(MyContext);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (context) {
      getPageData();
    }
  }, [JSON.stringify(context)]);
  const getPageData = () => {
    const { userIdList } = context;
    funnelByDealValue({ userIdList, filterBy: 4 }).then((res) => {
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
    let xData = [];
    let yData1 = [];
    let yData2 = [];
    data.forEach((ele) => {
      xData.push(ele.name);
      yData1.push(ele.prevValue); //预测值value
      yData2.push(ele.value); //预算值
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

  return !!data ? (
    <ReactEChartsCore
      echarts={echarts}
      option={getOption()}
      lazyUpdate={true}
    />
  ) : null;
}
