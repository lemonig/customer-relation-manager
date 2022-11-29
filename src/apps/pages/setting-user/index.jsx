import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import Department from "./Department";
import Staff from "./Staff";

function SettingUser() {
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <Staff />
    // <Tabs
    //   defaultActiveKey="1"
    //   onChange={onChange}
    //   items={[
    //     {
    //       label: `人员`,
    //       key: "1",
    //       children: <Staff />,
    //     },
    //     {
    //       label: `部门`,
    //       key: "2",
    //       children: <Department />,
    //     },
    //   ]}
    // />
  );
}

export default SettingUser;
