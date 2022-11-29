import React, { useEffect, useLayoutEffect, useState } from "react";
import { DndProvider, DragSource } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Dustbin } from "./components/Dustbin";
import StageBlock from "@Components/StageBlock";
import "./index.less";
import { reqD } from "./test";

function Deal() {
  let [stageArr, setstageArr] = useState([
    {
      id: 1,
      data: [],
    },
    {
      id: 2,
      data: [],
    },
    {
      id: 3,
      data: [],
    },
    {
      id: 4,
      data: [],
    },
  ]);

  useLayoutEffect(() => {
    const abortController = new AbortController();
    ("xxx");
    hadleData();
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
          {stageArr.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="deal-stage-item">
                <StageBlock />
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
