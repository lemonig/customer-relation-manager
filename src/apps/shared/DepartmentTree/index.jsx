import React, { useState, useEffect } from "react";
import { DatePicker, Space, TreeSelect } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { deptList as deptListApi } from "@Api/set_dept.js";
import { arrayToTree } from "@Utils/util";

function DepartmentTree({ value = {}, onChange }) {
  const [deptList, setDeptList] = useState([]);

  useEffect(() => {
    getDeptList();
  }, []);

  //部门
  const getDeptList = async () => {
    let { data } = await deptListApi();

    let res = arrayToTree(data);

    setDeptList(res);
  };

  return (
    <TreeSelect
      showSearch
      style={{ width: 300 }}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="部门"
      allowClear
      treeDefaultExpandAll
      treeData={deptList}
    />
  );
}

export default DepartmentTree;
