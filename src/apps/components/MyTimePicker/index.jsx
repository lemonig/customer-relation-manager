import React, { useState, useEffect } from "react";
import { DatePicker, Space, Select } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function MyTimePicker({ value = {}, onChange }) {
  const [date, setDate] = useState();
  const [time, setTime] = useState("0000");
  // TODO日期填充报错
  useEffect(() => {
    console.log(dayjs());
    if (Reflect.has(value, "date")) {
      console.log(value);
      // setDate(dayjs(value.date).format());
      setDate(value.date);
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
    // if (!("date" in value)) {
    //   setDate(date);
    // }
    triggerChange({
      date: dayjs(date).format("YYYYMMDD"),
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
      <DatePicker onChange={onDateChange} value={date} />
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
