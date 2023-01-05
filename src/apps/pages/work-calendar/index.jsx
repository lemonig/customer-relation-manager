import React from "react";
import { Badge, Calendar } from "antd";
import { useEffect } from "react";
import { activeCalendar } from "@Api/set_active.js";
import moment from "moment";
import { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { activeList } from "@Api/set_active.js";
import IconFont from "@Components/IconFont";

const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};

function WorkCalender() {
  const [searchForm] = Form.useForm();
  const [data, setData] = useState({});
  const [datese, setDatese] = useState(moment().format());
  const [activeData, setActiveData] = useState([]);
  useEffect(() => {
    getPageData();
  }, [JSON.stringify(datese)]);

  useEffect(() => {
    getActiveData();
  }, []);
  const getActiveData = async () => {
    let { data } = await activeList();
    setActiveData(data);
  };

  const getPageData = async () => {
    let values = searchForm.getFieldsValue();
    values.year = moment(datese).year();
    values.month = moment(datese).month() + 1;

    let { data } = await activeCalendar(values);
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
      }));
    } else {
      return [];
    }
  };

  return (
    <>
      <div className="search" style={{ marginBottom: "0px" }}>
        <Form layout="inline" form={searchForm} onFinish={getPageData}>
          <Form.Item label="" name="name">
            <Input
              placeholder="请输入商机名称、客户公司名称"
              style={{ width: 240 }}
              // value={searchVal}
            />
          </Form.Item>

          <Form.Item label="" name="typeIdList">
            <Select
              style={{ width: 240 }}
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
              options={activeData}
              placeholder="任务类型"
              mode="multiple"
            />
          </Form.Item>

          <Form.Item label="" name="statusList">
            <Select
              style={{ width: 240 }}
              options={[
                {
                  label: "待办",
                  value: "1",
                },
                // {
                //   label: "超时待办",
                //   value: "3",
                // },
                {
                  label: "已完成",
                  value: "2",
                },
              ]}
              placeholder="任务状态"
              mode="multiple"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      {data && (
        <Calendar
          dateCellRender={dateCellRender}
          onPanelChange={handledateSelect}
        />
      )}
    </>
  );
}

export default WorkCalender;
