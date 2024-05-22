import React, { useState, useEffect, useContext } from "react";
import Box from "./Box";
import Block from "./Block";
import { Col, Divider, Row } from "antd";
import { saleSimpleReport } from "@Api/dashboard";
import ContractView from "@Shared/ContractView";
import TaskView from "@Shared/TaskViewp";
import DealView from "@Shared/DealView";
import "./index.less";
import { MyContext } from "../context";

const style = {
  background: "#0092ff",
  padding: "8px 0",
};

const salePanel = [
  {
    label: "新签合同",
    val: "2",
    unit: "个",
    link: "contract",
    key: "contractAddNum",
    type: 5,
  },
  {
    label: "合同金额",
    val: "6",
    unit: "",
    link: "contract",
    key: "contractValue",
    type: 3,
  },
  {
    label: "回款金额",
    val: "5",
    unit: "个",
    link: "contract",
    key: "contractReceivedValue",
    type: 4,
  },
  {
    label: "新增商机",
    val: "4",
    unit: "个",
    link: "deal",
    key: "dealAddNum",
    type: 7,
  },
  {
    label: "新增商机金额",
    val: "3",
    unit: "",
    link: "deal",
    key: "dealAddValue",
    type: 7,
  },
  {
    label: "商机金额预测",
    val: "2",
    unit: "",
    link: "deal",
    key: "dealPrevValue",
    type: 7,
  },
  {
    label: "赢单商机",
    val: "2",
    unit: "个",
    link: "deal",
    key: "dealWinNum",
    type: 4,
  },

  {
    label: "输单商机",
    val: 60000,
    unit: "个",
    link: "deal",
    key: "dealLoseNum",
    type: 5,
  },
  {
    label: "终止商机",
    val: 400000,
    unit: "个",
    link: "deal",
    key: "dealTerminateNum",
    type: 6,
  },
  {
    label: "新增跟进记录",
    val: 200,
    unit: "个",
    link: "task",
    key: "followUpAddNum",
    type: 4,
  },
];

function Panel2() {
  const context = useContext(MyContext);
  const [data, setData] = useState(null);
  const [modalVis, setModalVis] = useState({
    contract: false,
    deal: false,
    task: false,
  });
  const [selectType, setSelectType] = useState();
  const [selectLabel, setSelectLabel] = useState();
  useEffect(() => {
    if (context.timeBy) {
      getPageData();
    }
  }, [JSON.stringify(context)]);

  const getPageData = () => {
    saleSimpleReport({ ...context }).then((res) => {
      setData(res.data);
    });
  };
  const handleCaptureClick = (e) => {
    // 获取目标元素的自定义属性
  };
  const handleBlockClick = (view, type, label) => {
    setSelectType(type);
    setModalVis({
      ...modalVis,
      [view]: true,
    });
    setSelectLabel(label);
  };
  const closeModal = () => {
    setModalVis({
      contract: false,
      deal: false,
      task: false,
    });
  };
  return (
    <>
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
                  link={item.link}
                  onClick={() =>
                    handleBlockClick(item.link, item.type, item.label)
                  }
                ></Block>
              ))}
          </div>
        </Box>
      </div>
      {modalVis.task && (
        <TaskView
          open={modalVis.task}
          getRowSelected={closeModal}
          params={{
            type: selectType,
            label: selectLabel,
            timeBy: context.timeBy,
            userIdList: context.userIdList,
          }}
        />
      )}
      {modalVis.contract && (
        <ContractView
          open={modalVis.contract}
          getRowSelected={closeModal}
          params={{
            type: selectType,
            label: selectLabel,
            timeBy: context.timeBy,
            userIdList: context.userIdList,
          }}
        />
      )}
      {modalVis.deal && (
        <DealView
          open={modalVis.deal}
          getRowSelected={closeModal}
          params={{
            type: selectType,
            label: selectLabel,
            timeBy: context.timeBy,
            userIdList: context.userIdList,
          }}
        />
      )}
    </>
  );
}

export default Panel2;
