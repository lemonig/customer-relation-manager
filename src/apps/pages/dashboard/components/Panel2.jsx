import React, { useState, useEffect } from "react";
import Box from "./Box";
import Block from "./Block";
import { Col, Divider, Row } from "antd";
import { saleSimpleReport } from "@Api/dashboard";
import "./index.less";

const style = {
  background: "#0092ff",
  padding: "8px 0",
};

const salePanel = [
  {
    label: "新签合同",
    val: "2",
    unit: "个",
    link: "task",
    key: "contractAddNum",
  },
  {
    label: "合同金额",
    val: "6",
    unit: "",
    link: "task",
    key: "contractValue",
  },
  {
    label: "回款金额",
    val: "5",
    unit: "个",
    link: "task",
    key: "contractReceivedValue",
  },
  {
    label: "新增商机",
    val: "4",
    unit: "个",
    link: "deal",
    key: "dealAddNum",
  },
  {
    label: "新增商机金额",
    val: "3",
    unit: "",
    link: "deal",
    key: "dealAddValue",
  },
  {
    label: "商机金额预测",
    val: "2",
    unit: "",
    link: "deal",
    key: "dealPrevValue",
  },
  {
    label: "赢单商机",
    val: "2",
    unit: "个",
    link: "deal",
    key: "dealWinNum",
  },

  {
    label: "输单商机",
    val: 60000,
    unit: "个",
    link: "deal",
    key: "dealLoseNum",
  },
  {
    label: "终止商机",
    val: 400000,
    unit: "个",
    link: "contract",
    key: "dealTerminateNum",
  },
  {
    label: "新增跟进记录",
    val: 200,
    unit: "个",
    link: "contract",
    key: "followUpAddNum",
  },
];

function Panel2({ params }) {
  console.log(params);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (params.filterBy && params.timeBy) {
      getPageData();
    }
  }, [params.timeBy, params.filterBy]);

  const getPageData = () => {
    saleSimpleReport({ ...params }).then((res) => {
      setData(res.data);
    });
  };

  return (
    <div>
      <Box title="销售简报">
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

export default Panel2;
