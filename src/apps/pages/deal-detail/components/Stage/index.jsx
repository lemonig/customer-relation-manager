import React from "react";
import "./index.less";
function Stage({ msg }) {
  return (
    msg && (
      <div className="pipeline-stage open">
        <ul>
          {msg.map((item) => (
            <li key={item.id} className={item.isShow ? `active` : ""}>
              <div className="stage-content">
                <span className="stagename">{item.days}</span>
                <span className="stage-arrow"></span>
              </div>
            </li>
          ))}
        </ul>
        <span className="text">{msg[0].name}</span>
      </div>
    )
  );
}

export default Stage;
