import React, { useState, useEffect, useContext } from "react";
import Box from "./Box";
import Block from "./Block";
import { Col, Divider, Row } from "antd";
import { saleCount } from "@Api/dashboard";
import ContractView from "@Shared/ContractView";
import TaskView from "@Shared/TaskViewp";
import DealView from "@Shared/DealView";
import "./index.less";
import { MyContext } from "../context";

const style = {
  background: "#0092ff",
  padding: "8px 0",
};
// 1: 今日代办 2: 全部代办 3: 超期代办 4: 新增跟进记录
// 1: 商机数量 新增商机 新增商机金额 商机预测 2: 无跟进计划商机 3: 无变化商机 4: 赢单商机 5: 输单商机 6: 终止商机
// 1: 应收未收额 2: 已开票未收款 3: 合同金额 4: 回款金额 5: 新增合同
const salePanel = [
  {
    label: "今日任务",
    val: "0",
    unit: "个",
    link: "task",
    key: "todayActivityCount",
    type: 1,
  },
  {
    label: "全部待办",
    val: "0",
    unit: "个",
    link: "task",
    key: "allActivityCount",
    type: 2,
  },
  {
    label: "超期任务",
    val: "0",
    unit: "个",
    link: "task",
    key: "overdueActivityCount",
    type: 3,
  },
  {
    label: "商机数量",
    val: "0",
    unit: "个",
    link: "deal",
    key: "dealCount",
    type: 1,
  },
  {
    label: "无跟进计划商机",
    val: "0",
    unit: "个",
    link: "deal",
    key: "noFollowUpDealCount",
    type: 2,
  },
  {
    label: "无变化商机",
    val: "0",
    unit: "个",
    link: "deal",
    key: "noChangeDealCount",
    type: 3,
  },
  {
    label: "商机金额",
    val: "0",
    unit: "",
    link: "deal",
    key: "allDealValue",
    type: 1,
  },

  {
    label: "商机金额预测",
    val: 0,
    unit: "",
    link: "deal",
    key: "prevDealValue",
    type: 1,
  },
  {
    label: "未收款",
    val: 0,
    unit: "",
    link: "contract",
    key: "unreceivedValue",
    type: 6,
  },
  {
    label: "已开票未收款",
    val: 0,
    unit: "",
    link: "contract",
    key: "invoicedUnreceivedValue",
    type: 2,
  },
];

function Panel1() {
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
    if (context) {
      getPageData();
    }
  }, [JSON.stringify(context)]);

  const getPageData = () => {
    const { userIdList } = context;
    saleCount({ userIdList }).then((res) => {
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
        <Box title="我的销售">
          <div className="search"></div>
          <div className="flexbox" onClickCapture={handleCaptureClick}>
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
            userIdList: context.userIdList,
          }}
        />
      )}
    </>
  );
}

export default Panel1;
