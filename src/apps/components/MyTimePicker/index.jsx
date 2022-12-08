import React, { useState, useEffect } from "react";
import { DatePicker, Space, Select } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";

function MyTimePicker({ value = {}, onChange }) {
  const [date, setDate] = useState(moment());
  const [time, setTime] = useState("0000");
  // TODO日期填充报错 因change 所以产生了 受控组件，triger的时候 格式变化了，所以导致datepicker返回的时候不是时间了，加个时间格式化就可
  console.log(moment().minutes());
  console.log(moment().hours());
  console.log(moment().format("HHmm"));
  useEffect(() => {
    console.log(value);
    if (Reflect.has(value, "date")) {
      setDate(moment(value.date));
      setTime(value.time);
    }
  }, [JSON.stringify(value)]);
  const triggerChange = (changedValue) => {
    onChange?.({
      date,
      time,
      ...value,
      ...changedValue,
    });
  };
  const creatTimeItem = () => {
    const timeList = [];

    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j = j + 15) {
        timeList.push({
          label: (i < 10 ? `0${i}` : `${i}`) + ":" + (j === 0 ? `00` : `${j}`),
          value: (i < 10 ? `0${i}` : `${i}`) + (j === 0 ? `00` : `${j}`),
        });
      }
    }
    return timeList;
  };

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
    // if (Number.isNaN(date)) {
    //   return;
    // }
    if (!("date" in value)) {
      setDate(date);
    }
    triggerChange({
      date: moment(date).format("YYYYMMDD"),
    });
  };

  const handleTimeChange = (val) => {
    console.log(val);
    if (!("time" in value)) {
      setTime(val);
    }
    triggerChange({
      time: val,
    });
  };
  return (
    <Space>
      <DatePicker onChange={onDateChange} value={date} allowClear={false} />
      <Select
        suffixIcon={<ClockCircleOutlined />}
        placeholder="请选择时间"
        style={{
          width: 120,
        }}
        onChange={handleTimeChange}
        options={creatTimeItem()}
        value={time}
      />
    </Space>
  );
}

export default MyTimePicker;
