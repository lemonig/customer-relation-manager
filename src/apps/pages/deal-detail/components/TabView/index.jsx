import React from "react";
import { Tabs } from "antd";
import Logs from "../Logs";
import TaskList from "./TaskList";
import TimeLine from "./TimeLine";

function TabView() {
  return (
    <div>
      <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
        <Tabs.TabPane tab="时间线" key="1">
          <TimeLine></TimeLine>
        </Tabs.TabPane>
        <Tabs.TabPane tab="任务" key="2">
          <TaskList></TaskList>
        </Tabs.TabPane>
        <Tabs.TabPane tab="变更日志" key="3">
          <Logs></Logs>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default TabView;
