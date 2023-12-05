import React, { useState, useEffect } from "react";
import { Timeline } from "antd";
import { dealTimeline as dealTimelineApi } from "@Api/deal_list";
import { useParams, useSearchParams } from "react-router-dom";

function TimeLine() {
  const [getParams, setParam] = useSearchParams();
  const pipelineId = getParams.getAll("pipelineId")[0];
  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let res = await dealTimelineApi({
      id: pipelineId,
    });
    setData(res.data);
  };
  return (
    <div
      style={{
        paddingTop: "20px",
      }}
    >
      <Timeline>
        {data.map((item, index) => (
          <Timeline.Item key={index}>
            <div
              style={{
                fontSize: "14px",
                color: " rgba(16, 16, 16, 1);",
                fontWeight: "bold",
              }}
            >
              {item.message}
            </div>
            <div
              style={{
                color: "#AEAEAE",
              }}
            >
              {item.createTime}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}

export default TimeLine;
