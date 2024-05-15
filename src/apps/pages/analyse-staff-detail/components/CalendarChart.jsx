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
import TaskView from "@Shared/TaskView";

const weekText = ["日", "一", "二", "三", "四", "五", "六"];

function CalendarChart() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [modalVis, setModalVis] = useState(false);
  const [selectedVal, setSelectedVal] = useState("");

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
      generatedData.push([
        echarts.time.format(time, "{yyyy}-{MM}-{dd}", false),
        timeS in value ? value[timeS] : 0,
      ]);
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
        hoverLink: true,
        pieces: [
          { value: 0, color: "#EDEDED" },
          { value: 1, color: "#ACD5F2" },
          { value: 2, color: "#7FA8C9" },
          { value: 3, color: "#527BA0" },
          { value: 4, color: "#254E77" },
          { gte: 5, color: "#000" },
        ],
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
          let week = moment(params.value[0]).day();
          let weekWord = weekText[week];
          let html;
          if (params.value[1] === 0) {
            html = `<div>
            <p>无任务</p>
            <p>
            <Space>
            周${weekWord}
            ${params.value[0]}
            </Space>
            </p>
            </div>`;
          } else {
            html = `
            <div>
            <p>
              <Space>
                <span>
                ${params.value[1]}</span>
              个任务
              </Space>
            </p>
            <p>${params.value[0]}</p>
              </div>
               `;
          }
          return html;
        },
      },

      calendar: {
        top: 20,
        left: "center",
        range: moment().year(),

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
  const onChartClick = (params) => {
    console.log(params);
    if (params.componentSubType === "heatmap") {
      const selectedDate = params.value[0];
      if (selectedDate) {
        setModalVis(true);
        setSelectedVal(selectedDate);
      }
    }
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
        onEvents={{ click: onChartClick }}
      />
      {modalVis && (
        <TaskView
          open={modalVis}
          getRowSelected={() => setModalVis(false)}
          params={{
            time: selectedVal,
            id,
          }}
        ></TaskView>
      )}
    </div>
  );
}

export default CalendarChart;
