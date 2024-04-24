import React from "react";
import "./index.less";

function SdTag({ color, style, ...props }) {
  return (
    <span
      style={{
        backgroundColor: color,
        ...props,
        "--bg-color": color,
      }}
      class="half-circle"
    >
      {props.children}
    </span>
  );
}

export default SdTag;
