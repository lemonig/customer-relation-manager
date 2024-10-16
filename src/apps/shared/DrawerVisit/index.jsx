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
import Tab3 from "./components/Tab3";
import Tab4 from "./components/Tab4";
import Tab5 from "./components/Tab5";
import Tab6 from "./components/Tab6";

export const Context = React.createContext();

function Index(props) {
  if (!props.id) {
    return;
  }
  const onChange = () => {};
  let word = "userIdList";
  return (
    <Context.Provider value={{ id: props.id, time: props.time, word }}>
      <SdDrawer
        {...props}
        title={
          <PageHeader
            className="site-page-header"
            title={props.title + "-拜访统计"}
          />
        }
      >
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          items={[
            {
              label: `完成任务`,
              key: "1",
              children: <Tab1 />,
            },
            {
              label: `新建商机`,
              key: "2",
              children: <Tab2 />,
            },
            {
              label: `拜访客户`,
              key: "3",
              children: <Tab3 />,
            },
            {
              label: `新开客户`,
              key: "4",
              children: <Tab4 />,
            },
            {
              label: `新增联系人`,
              key: "5",
              children: <Tab5 />,
            },
            {
              label: `签订合同`,
              key: "6",
              children: <Tab6 />,
            },
          ]}
        />
      </SdDrawer>
    </Context.Provider>
  );
}

export default Index;
