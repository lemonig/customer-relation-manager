import React from "react";
import "./index.less";
function Stage({ msg }) {
  return (
    msg && (
      <div className="pipeline-stage open">
        <ul>
          {msg.map((item) => (
            <li className={item.isShow ? `active` : ""}>
              <div className="stage-content">
                <span className="stagename">{item.days}</span>
                <span className="stage-arrow"></span>
              </div>
            </li>
          ))}
        </ul>
        {msg[0].name}
      </div>
    )
  );
}

export default Stage;
