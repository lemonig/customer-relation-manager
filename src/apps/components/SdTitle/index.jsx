import React from "react";
import "./index.less";

function SdTitle(props) {
  return (
    <div className="sd-title-wrap">
      <div className="left">{props.title}</div>
      <div className="right">{props.children}</div>
    </div>
  );
}

export default SdTitle;
