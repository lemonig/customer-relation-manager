import React from "react";
import { Col, Divider, Statistic } from "antd";
import "./box.less";

function Block({ title, value, unit, ...props }) {
  return (
    <div className="block" {...props}>
      <div className="section">
        <div className="title">{title}</div>
        <div className="value">
          {!unit ? (
            <Statistic value={value} valueStyle={{ fontSize: "20px" }} />
          ) : (
            <span>
              {value}
              <span className="value-unit">{unit}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Block;
