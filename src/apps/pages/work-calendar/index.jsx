import React from "react";
import { Badge, Calendar } from "antd";
import { useEffect } from "react";
import { activeCalendar } from "@Api/set_active.js";
import moment from "moment";
import { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { activeList } from "@Api/set_active.js";
import IconFont from "@Components/IconFont";
import DrawerTask from "@Shared/DrawerTask";

import StaffTree from "@Shared/StaffTree";
import { EyeOutlined } from "@ant-design/icons";
const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};

function WorkCalender() {
  const [searchForm] = Form.useForm();
  const [data, setData] = useState({});
  const [datese, setDatese] = useState(moment().format());
  const [drawerVis, setDrawerVis] = useState({
    task: false,
    deal: false,
    linkman: false,
    customer: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);
  const [userId, setUserId] = useState([]);
  const [treeVis, setTreeVis] = useState(false);
  useEffect(() => {
    getPageData();
  }, [JSON.stringify(datese)]);
  useEffect(() => {
    getPageData();
  }, [userId]);

  const getPageData = async () => {
    setData([]);
    let values = {};
    values.year = moment(datese).year();
    values.month = moment(datese).month() + 1;

    let { data } = await activeCalendar({
      year: moment(datese).year(),
      month: moment(datese).month() + 1,
      userIdList: userId,
    });
    setData(data);
  };

  const handledateSelect = (date, mode) => {
    setDatese(date);
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li
            key={item.content}
            style={{ color: item.type ? "gray" : "black" }}
            onClick={() => {
              if (!item.id) return;
              setOperateId(item.id);
              setOperateTxt(item.subject);
              setDrawerVis({
                ...drawerVis,
                task: true,
              });
            }}
          >
            {item.type ? (
              <IconFont
                iconName="wancheng"
                color="#DEDEDE"
                style={{ cursor: "pointer" }}
                size={18}
              />
            ) : (
              <IconFont
                iconName="weikao"
                color="#DEDEDE"
                style={{ cursor: "pointer" }}
                size={16}
              />
            )}
            <span style={{ marginLeft: "4px" }}>{item.content}</span>
          </li>
        ))}
      </ul>
    );
  };

  const getListData = (value) => {
    let res = data[value.format("YYYY-MM-DD")];
    if (res) {
      return res.map((item) => ({
        type: item.done,
        content: item.subject,
        ...item,
      }));
    } else {
      return [];
    }
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
    <>
      <div className="search" style={{ marginBottom: "0px" }}>
        <Button type="text" onClick={showPeopleTree} icon={<EyeOutlined />}>
          按人员筛选
        </Button>
      </div>
      {data && (
        <Calendar
          dateCellRender={dateCellRender}
          onPanelChange={handledateSelect}
        />
      )}{" "}
      {drawerVis.task && (
        <DrawerTask
          width="800"
          visible={drawerVis.task}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              task: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}
      <StaffTree open={treeVis} getRowSelected={getRowSelected} />
    </>
  );
}

export default WorkCalender;
