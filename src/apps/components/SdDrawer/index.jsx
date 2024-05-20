// src/components/Index.js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.less";

const Index = ({
  visible,
  onClose,
  children,
  direction = "right",
  width = "600",
  title,
}) => {
  const [isOpen, setIsOpen] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsOpen(true);
    } else {
      // 延迟关闭以显示淡出动画
      const timer = setTimeout(() => setIsOpen(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <div
          className={`drawer-overlay ${visible ? "open" : ""}`}
          onClick={handleClose}
        ></div>
      )}
      <div
        className={`drawer drawer-${direction} ${visible ? "open" : ""}`}
        style={{ width: width.concat("px") }}
      >
        <div className="header">
          <div className="main">
            {/* <button className="drawer-close" onClick={handleClose}>
              Close
            </button> */}
            <div className="title">{title}</div>
          </div>
        </div>
        <div className="body">{children}</div>
      </div>
    </>,
    document.body
  );
};

export default Index;
