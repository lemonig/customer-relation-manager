import React from "react";
import "./index.less";

function SdTitle({ title, children }) {
  return (
    <div className="sd-title-wrap">
      <div className="left">{title}</div>
      <div className="right">{children}</div>
    </div>
  );
}

export default SdTitle;
