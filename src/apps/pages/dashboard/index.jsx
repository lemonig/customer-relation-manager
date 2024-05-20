import React, { useEffect, useLayoutEffect, useState } from "react";
import "./index.less";
import {
  Input,
  Button,
  DatePicker,
  Form,
  Select,
  Tooltip,
  Spin,
  Statistic,
  TreeSelect,
  PageHeader,
} from "antd";
import moment from "moment";
import Box from "./components/Box";
import Panel1 from "./components/Panel1";
import Panel2 from "./components/Panel2";
import Panel3 from "./components/Panel3";
import Panel4 from "./components/Panel4";
import Panel5 from "./components/Panel5";
import Panel6 from "./components/Panel6";

function Dashboard() {
  const [value, setValue] = useState("3");
  const [value1, setValue1] = useState("1");

  useEffect(() => {}, []);

  const option = [
    {
      label: "仅本人",
      value: "1",
    },
    {
      label: "我下属的",
      value: "2",
    },
    {
      label: "我及我下属的",
      value: "3",
    },
    {
      label: "按部门与人员",
      value: "4",
    },
  ];
  const option1 = [
    {
      label: "本周",
      value: "1",
    },
    {
      label: "本月",
      value: "2",
    },
    {
      label: "本季度",
      value: "3",
    },
    {
      label: "本年",
      value: "4",
    },
    {
      label: "上月",
      value: "5",
    },
    {
      label: "上周",
      value: "6",
    },
    {
      label: "上季度",
      value: "7",
    },
    {
      label: "上年",
      value: "8",
    },
  ];

  const handleChange = (value) => {
    setValue(value);
  };
  const handleChange1 = (value) => {
    setValue1(value);
  };

  return (
    <div className="board-page">
      <PageHeader className="site-page-header" title="CRM仪表盘" />
      <div className="search-tool">
        <div>
          <Select
            style={{ width: 120 }}
            options={option}
            value={value}
            onChange={handleChange}
          />
        </div>
        <div>
          <Select
            style={{ width: 120 }}
            options={option1}
            value={value1}
            onChange={handleChange1}
          />
        </div>
      </div>
      <div className="main">
        {value && (
          <>
            <div className="left">
              <Panel1 params={{ filterBy: value, timeBy: value1 }} />
              <Panel3 params={{ filterBy: value, timeBy: value1 }} />
              <Panel5 params={{ filterBy: value, timeBy: value1 }} />
            </div>
            <div className="right">
              <Panel2 params={{ filterBy: value, timeBy: value1 }} />
              <Panel4 params={{ filterBy: value, timeBy: value1 }} />
              <Panel6 params={{ filterBy: value, timeBy: value1 }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
