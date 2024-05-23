import React, { useEffect, useLayoutEffect, useState } from "react";
import "./index.less";
import { Button, Select, PageHeader } from "antd";
import Panel1 from "./components/Panel1";
import Panel2 from "./components/Panel2";
import Panel3 from "./components/Panel3";
import Panel4 from "./components/Panel4";
import Panel5 from "./components/Panel5";
import Panel6 from "./components/Panel6";
import StaffTree from "@Shared/StaffTree";
import { EyeOutlined } from "@ant-design/icons";
import { MyContext } from "./context";
import { timeOption } from "./constant";

function Dashboard() {
  const [value1, setValue1] = useState("1");
  const [treeVis, setTreeVis] = useState(false);
  const [userId, setUserId] = useState([]);
  useEffect(() => {}, []);

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
              options={timeOption}
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
                    userIdList: userId,
                  }}
                />

                <Panel4 params={{ timeBy: value1 }} />
                <Panel6 params={{ timeBy: value1 }} />
              </div>
              <div className="right">
                <Panel2 params={{ timeBy: value1 }} />
                <Panel3
                  params={{
                    timeBy: value1,
                    userIdList: userId,
                  }}
                />
                <Panel5 params={{ timeBy: value1 }} />
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
