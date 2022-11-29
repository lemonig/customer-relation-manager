import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./index.less";

const Loading = ({ dispatch, id, load }) => {
  const [widthPro, setWidthPro] = useState(100);
  let loadStyle = { width: widthPro + "%" };
  const { showLoading, loadType, loadText } = useSelector((store) => store);
  return (
    <div>
      {showLoading ? (
        <div id={id} className="loading" style={loadStyle}></div>
      ) : null}
      {showLoading && loadType == "full" ? (
        <section className="full-load">
          <div className="text">{loadText}</div>
          <div className="load">
            <div>L</div>
            <div>O</div>
            <div>A</div>
            <div>D</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Loading;
