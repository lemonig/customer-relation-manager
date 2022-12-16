import React from "react";
import "./index.less";

function StageBlock({ title, msgPre, msgAft }) {
  return (
    <div className="stage-block">
      <div className="inner">
        <div className="content">
          <div>{title}</div>
          <div>
            <span>预测：{msgPre}</span>

            <span style={{ marginLeft: "16px" }}>{msgAft}笔</span>
          </div>
        </div>
        <svg
          className="arrow"
          width="16"
          height="56"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <g fill="none" fillRule="evenodd">
            <path
              className="arrow__right"
              fill="#F7F7F7"
              d="M0 0h16v56H0z"
            ></path>
            <path
              className="arrow__border"
              fill="#E5E5E5"
              d="M1 0l8 28-8 28H0V0z"
            ></path>
            <path
              className="arrow__left"
              fill="#F7F7F7"
              d="M0 1l8 27-8 27z"
            ></path>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default StageBlock;
