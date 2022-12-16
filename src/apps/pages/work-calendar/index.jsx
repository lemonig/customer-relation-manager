import React from "react";
import { Badge, Calendar } from "antd";
import { useEffect } from "react";
import { activeCalendar } from "@Api/set_active.js";
import moment from "moment";
import { useState } from "react";
import {
  Button,
  Form,
  Input,
  PageHeader,
  Space,
  Select,
  Row,
  Col,
  message,
  InputNumber,
} from "antd";
import {
  activeList,
  activeDelete,
  activeUpdate,
  activeAdd,
} from "@Api/set_active.js";

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
    console.log(JSON.stringify(datese));
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
    console.log(data);
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
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const getListData = (value) => {
    console.log(value.format("YYYY-MM-DD "));
    let res = data[value.format("YYYY-MM-DD")];
    if (res) {
      return res.map((item) => ({
        type: item.done ? "success" : "warning",
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
              placeholder="请选择"
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
                {
                  label: "超时待办",
                  value: "3",
                },
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
