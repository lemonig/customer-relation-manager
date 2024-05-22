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
import StaffTree from "@Shared/StaffTree";
import { EyeOutlined } from "@ant-design/icons";
import { MyContext } from "./context";

function Dashboard() {
  const [value1, setValue1] = useState("1");
  const [treeVis, setTreeVis] = useState(false);
  const [userId, setUserId] = useState([]);
  useEffect(() => {}, []);

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

  const handleChange1 = (value) => {
    setValue1(value);
  };
  const showPeopleTree = () => {
    setTreeVis(true);
  };

  const getRowSelected = (flag, val) => {
    setTreeVis(false);
    if (flag) {
      setUserId(val);
    }
  };
  return (
    <MyContext.Provider value={{ timeBy: value1, userIdList: userId }}>
      <div className="board-page">
        <PageHeader className="site-page-header" title="CRM仪表盘" />
        <div className="search-tool">
          <div>
            <Button type="text" onClick={showPeopleTree} icon={<EyeOutlined />}>
              按人员筛选
            </Button>
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
          {value1 && (
            <>
              <div className="left">
                <Panel1
                  params={{
                    timeBy: value1,
                    userIdList: userId,
                  }}
                />
                <Panel3
                  params={{
                    timeBy: value1,
                    userIdList: userId,
                  }}
                />
                <Panel5 params={{ timeBy: value1 }} />
              </div>
              <div className="right">
                <Panel2 params={{ timeBy: value1 }} />
                <Panel4 params={{ timeBy: value1 }} />
                <Panel6 params={{ timeBy: value1 }} />
              </div>
            </>
          )}
        </div>
      </div>

      <StaffTree open={treeVis} getRowSelected={getRowSelected} />
    </MyContext.Provider>
  );
}

export default Dashboard;
