// src/components/Index.js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.less";
import { useSpring, animated, config } from "@react-spring/web";

const Index = ({
  visible,
  onClose,
  children,
  direction = "right",
  width = "1000",
  title,
}) => {
  const [isOpen, setIsOpen] = useState(visible);

  // useEffect(() => {
  //   if (visible) {
  //     setIsOpen(true);
  //   } else {
  //     // 延迟关闭以显示淡出动画
  //     const timer = setTimeout(() => setIsOpen(false), 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [visible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const drawerAnimation = useSpring({
    from: { transform: isOpen ? "translateX(100%)" : "translateX(0%)" },
    to: {
      transform: isOpen ? "translateX(0%)" : "translateX(100%)",
    },
    // transform: isOpen ? "translateX(0%)" : "translateX(100%)",
    config: config.wobbly,
    onRest: () => {
      if (!isOpen) {
        drawerAnimation.visibility = "hidden";
      }
    },
  });

  const maskAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 300 },
    onRest: () => {
      if (!isOpen) {
        maskAnimation.visibility = "hidden";
      }
    },
  });
  return ReactDOM.createPortal(
    <>
      {/* {isOpen && (
        <div
          className={`drawer-overlay ${visible ? "open" : ""}`}
          onClick={handleClose}
        ></div>
      )} */}
      {/* <div
        className={`drawer drawer-${direction} ${visible ? "open" : ""}`}
        style={{ width: width.concat("px") }}
      >
        <div className="header">
          <div className="main">
  
            <div className="title">{title}</div>
          </div>
        </div>
        <div className="body">{children}</div>
      </div> */}
      <animated.div
        style={maskAnimation}
        className="drawer-overlay"
        onClick={handleClose}
      />
      <animated.div
        style={{
          ...drawerAnimation,
          position: "fixed",
          top: 0,
          right: 0,
          width: width + "px",
          height: "100%",
          backgroundColor: "#fff",
          zIndex: 1001,
        }}
      >
        <div className="header">
          <div className="main">
            <div className="title">{title}</div>
          </div>
        </div>
        <div className="body">{children}</div>
      </animated.div>
    </>,
    document.body
  );
};

export default Index;
