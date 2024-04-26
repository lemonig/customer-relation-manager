import React, { useState, useEffect } from "react";
import Box from "./Box";
import Block from "./Block";
import { Col, Divider, Row } from "antd";
import { saleCount } from "@Api/dashboard";
import "./index.less";

const style = {
  background: "#0092ff",
  padding: "8px 0",
};

const salePanel = [
  {
    label: "今日任务",
    val: "2",
    unit: "个",
    link: "task",
    key: "todayActivityCount",
  },
  {
    label: "全部待办",
    val: "6",
    unit: "个",
    link: "task",
    key: "allActivityCount",
  },
  {
    label: "超期任务",
    val: "5",
    unit: "个",
    link: "task",
    key: "overdueActivityCount",
  },
  {
    label: "商机数量",
    val: "4",
    unit: "个",
    link: "deal",
    key: "dealCount",
  },
  {
    label: "无跟进计划商机",
    val: "3",
    unit: "个",
    link: "deal",
    key: "noFollowUpDealCount",
  },
  {
    label: "无变化商机",
    val: "2",
    unit: "个",
    link: "deal",
    key: "noChangeDealCount",
  },
  {
    label: "商机金额",
    val: "2",
    unit: "",
    link: "deal",
    key: "allDealValue",
  },

  {
    label: "商机金额预测",
    val: 60000,
    unit: "",
    link: "deal",
    key: "prevDealValue",
  },
  {
    label: "应收未收额",
    val: 400000,
    unit: "",
    link: "contract",
    key: "unreceivedValue",
  },
  {
    label: "已开票未收款",
    val: 200,
    unit: "",
    link: "contract",
    key: "invoicedUnreceivedValue",
  },
];

function Panel1({ params }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (params.filterBy && params.timeBy) {
      getPageData();
    }
  }, [params.timeBy, params.filterBy]);

  const getPageData = () => {
    saleCount({ ...params }).then((res) => {
      setData(res.data);
    });
  };

  return (
    <div>
      <Box title="我的销售">
        <div className="search"></div>
        <div className="flexbox">
          {data &&
            salePanel.map((item) => (
              <Block
                key={item.key}
                title={item.label}
                value={data[item.key]}
                unit={item.unit}
              ></Block>
            ))}
        </div>
      </Box>
    </div>
  );
}

export default Panel1;
