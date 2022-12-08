import React from "react";
import "./index.less";
function Stage() {
  return (
    <div className="pipeline-stage open">
      <ul>
        <li className="active">
          <div className="stage-content">
            <span className="stagename">0</span>
            <span className="stage-arrow"></span>
          </div>
        </li>
        <li className="active">
          <div className="stage-content">
            <span className="stagename">0</span>
            <span className="stage-arrow"></span>
          </div>
        </li>
        <li className="active">
          <div className="stage-content">
            <span className="stagename">0</span>
            <span className="stage-arrow"></span>
          </div>
        </li>
        <li className="active">
          <div className="stage-content">
            <span className="stagename">0</span>
            <span className="stage-arrow"></span>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Stage;
