import React, { useContext } from "react";
import SdDrawer from "@Components/SdDrawer";
import {
  Input,
  Button,
  Space,
  Table,
  Modal,
  message,
  PageHeader,
  DatePicker,
  Form,
  Select,
  Tooltip,
  Statistic,
  TreeSelect,
  Tabs,
} from "antd";
import Tab1 from "./components/Tab1";
import Tab2 from "./components/Tab2";

export const TaskContext = React.createContext();

function Index(props) {
  const onChange = () => {};
  return (
    <TaskContext.Provider value={props.id}>
      <SdDrawer
        {...props}
        title={<PageHeader className="site-page-header" title="任务" />}
      >
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          items={[
            {
              label: `任务信息`,
              key: "1",
              children: <Tab1></Tab1>,
            },
            {
              label: `变更记录`,
              key: "2",
              children: <Tab2></Tab2>,
            },
          ]}
        />
      </SdDrawer>
    </TaskContext.Provider>
  );
}

export default Index;
