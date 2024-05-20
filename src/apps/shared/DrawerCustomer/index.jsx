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
import Tab5 from "./components/Tab5";
import Tab3 from "../DrawerLinkman/components/Tab2";
import Tab4 from "../DrawerDeal/components/Tab3";

export const Context = React.createContext();

function Index(props) {
  const onChange = () => {};
  let word = "orgId";
  return (
    <Context.Provider value={props.id}>
      <SdDrawer
        {...props}
        title={<PageHeader className="site-page-header" title={props.title} />}
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
              children: <Tab2 id={props.id} word={word}></Tab2>,
            },
            {
              label: `商机`,
              key: "3",
              children: <Tab3 id={props.id} word={word}></Tab3>,
            },
            {
              label: `任务`,
              key: "4",
              children: <Tab4 id={props.id} word={word}></Tab4>,
            },
            {
              label: `合同`,
              key: "5",
              children: <Tab5 id={props.id} word={word}></Tab5>,
            },
          ]}
        />
      </SdDrawer>
    </Context.Provider>
  );
}

export default Index;
