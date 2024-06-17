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
import Tab7 from "./components/Tab7";
import Tab8 from "./components/Tab8";
import Tab9 from "./components/Tab9";

export const DealContext = React.createContext();

function Index(props) {
  const onChange = () => {};
  return (
    <DealContext.Provider value={props.id}>
      <SdDrawer
        {...props}
        title={
          <PageHeader
            className="site-page-header"
            title={"商机-" + props.title}
          />
        }
      >
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          items={[
            {
              label: `基本资料`,
              key: "1",
              children: <Tab1></Tab1>,
            },
            {
              label: `联系人`,
              key: "2",
              children: <Tab2 id={props.id} word="dealId"></Tab2>,
            },
            {
              label: `任务`,
              key: "3",
              children: <Tab3 id={props.id} word="dealId"></Tab3>,
            },
            {
              label: `产品`,
              key: "4",
              children: <Tab4></Tab4>,
            },
            {
              label: `招标代理`,
              key: "7",
              children: <Tab7></Tab7>,
            },
            {
              label: `合作伙伴`,
              key: "8",
              children: <Tab8></Tab8>,
            },
            {
              label: `竞争对手`,
              key: "9",
              children: <Tab9></Tab9>,
            },
            {
              label: `变更日志`,
              key: "5",
              children: <Tab6></Tab6>,
            },
            {
              label: `合同`,
              key: "6",
              children: <Tab5></Tab5>,
            },
          ]}
        />
      </SdDrawer>
    </DealContext.Provider>
  );
}

export default Index;
