import React, { useEffect, useLayoutEffect, useState } from "react";
import { DndProvider, DragSource } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Dustbin } from "./components/Dustbin";
import StageBlock from "@Components/StageBlock";
import "./index.less";
import { reqD } from "./test";
import { dealFunnel } from "@Api/deal_list";

function Deal() {
  let [stageArr, setstageArr] = useState([]);
  const [stageMsg, setStageMsg] = useState({});

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let params = {
      pipelineId: 1,
    };
    let { data } = await dealFunnel(params);
    console.log(data);
    setstageArr(data.detailCount);
    setStageMsg(data.totalCount);
  };
  useLayoutEffect(() => {
    const abortController = new AbortController();
    // hadleData();
    // return () => abortController.abort();
  }, []);

  const hadleData = () => {
    for (let i of reqD) {
      let res = stageArr.find((j) => j.id === i.stage_id);
      res.data.push(i);
    }
  };

  return (
    <div className="deal-wrap">
      <div className="deal-stage-scroll">
        <div className="deal-stage">
          {stageArr.length &&
            stageArr.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="deal-stage-item">
                  <StageBlock
                    title={item.name}
                    msgPre={item.prev}
                    msgAft={item.num}
                  />
                  <DndProvider backend={HTML5Backend}>
                    <div className="deal-main">
                      <Dustbin data={item} />
                    </div>
                  </DndProvider>
                </div>
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Deal;
