import React from "react";
import "./index.less";
function Stage({ msg, detail }) {
  return (
    msg && (
      <div className="pipeline-stage open">
        <ul>
          {msg.map((item) => (
            <li key={item.id} className={item.isShow ? `active` : ""}>
              <div className="stage-content">
                <span className="stagename">
                  {item.name + " " + item.days}天
                </span>
                <span className="stage-arrow"></span>
              </div>
            </li>
          ))}
        </ul>
        {/* <span className="text">{detail.name}</span> */}
      </div>
    )
  );
}

export default Stage;
