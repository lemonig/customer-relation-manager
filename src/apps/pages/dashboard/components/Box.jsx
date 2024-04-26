import React from "react";
import "./box.less";

function Box({ title, ...props }) {
  return (
    <div className="box-card">
      <div className="title">
        <div className="text">{title}</div>
      </div>
      <div>{props.children}</div>
    </div>
  );
}

export default Box;
