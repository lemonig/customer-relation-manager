import React, { useEffect, useState } from "react";
// import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
// import {
//   CalendarComponent,
//   TitleComponent,
//   TooltipComponent,
// } from "echarts/components";
// import { CanvasRenderer } from "echarts/renderers";
import { useParams } from "react-router-dom";
import ReactECharts from "echarts-for-react";

// echarts.use([
//   TitleComponent,
//   TooltipComponent,
//   CalendarComponent,
//   CanvasRenderer,
// ]);

import { calender as calenderApi } from "@Api/analyse_staff";
import moment from "moment";

function CalendarChart() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getPageData() {
      let res = await calenderApi({
        year: "2023",
        userId: id,
      });

      const newData = getVirtualData(res.data);
      setData(newData);
    }
    getPageData();
  }, []);

  function getVirtualData(value) {
    let year = moment().year();
    const date = +echarts.time.parse(`${year}-01-01`);
    const end = +echarts.time.parse(`${year}-12-31`);
    const dayTime = 3600 * 24 * 1000;
    const generatedData = [];

    for (let time = date; time <= end; time += dayTime) {
      let timeS = echarts.time.format(time, "{yyyy}-{MM}-{dd}");
      if (timeS in value) {
        generatedData.push([
          echarts.time.format(time, "{yyyy}-{MM}-{dd}", false),
          value[timeS],
        ]);
      } else {
        generatedData.push([
          echarts.time.format(time, "{yyyy}-{MM}-{dd}", false),
          0,
        ]);
      }
    }

    return generatedData;
  }

  const getOption = () => {
    return {
      visualMap: {
        min: 0,
        max: 5,
        type: "piecewise",
        orient: "horizontal",
        left: "center",
        bottom: "0",
        splitNumbe: 2,
        hoverLink: true,
        inRange: {
          color: ["#EDEDED", "#ACD5F2", "#7FA8C9", "#527BA0", "#254E77"],
          // color: ["#EDEDED", "#7FA8C9"],
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.7)",
        borderColor: "#333",
        textStyle: {
          color: "#fff",
        },
        borderWidth: 1,
        padding: [10, 15],
        formatter: (params) => {
          let html;
          if (params.value[1] === 0) {
            html = `<div>${params.value[0]}</div>`;
          } else {
            html = `
            <div>
            <p>${params.value[1]}</p>
            <p>${params.value[0]}</p>
              </div>
               `;
          }
          return html;
        },
      },

      calendar: {
        top: 0,
        left: "center",
        range: "2023",
        splitLine: {
          show: false,
        },
        cellSize: 18,

        itemStyle: {
          color: "#fff",
          borderColor: "#fff",
          borderWidth: 3,
        },
        dayLabel: {
          nameMap: "ZH",
          firstDay: 1,
          color: "#959494",
        },
        monthLabel: {
          nameMap: "ZH",
          color: "#959494",
        },
        yearLabel: {
          show: false,
          color: "#959494",
        },
      },
      series: {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: data,
      },
    };
  };

  return (
    <div>
      {/* <ReactEChartsCore
        echarts={echarts}
        option={getOption()}
        lazyUpdate={true}
        style={{ height: "400px", width: "100%" }}
      /> */}

      <ReactECharts
        option={getOption()}
        style={{ height: "180px" }}
        opts={{ renderer: "svg" }} // use svg to render the chart.
      />
    </div>
  );
}

export default CalendarChart;
