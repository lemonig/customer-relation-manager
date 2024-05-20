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
import Tab3 from "../DrawerDeal/components/Tab3";

export const Context = React.createContext();

function Index(props) {
  const onChange = () => {};
  let word = "personId";
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
              label: `商机`,
              key: "2",
              children: <Tab2 id={props.id} word={word}></Tab2>,
            },
            {
              label: `任务`,
              key: "3",
              children: <Tab3 id={props.id} word={word}></Tab3>,
            },
          ]}
        />
      </SdDrawer>
    </Context.Provider>
  );
}

export default Index;
