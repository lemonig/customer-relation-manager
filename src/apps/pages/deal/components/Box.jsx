import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
import IconFont from "@Components/IconFont";
import SdTag from "@Components/SdTag";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Avatar, Image, Tag, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import DrawerDeal from "@Shared/DrawerDeal";

import "./index.less";
const style = {};

export const Box = function Box({ data }) {
  // const [{ isDragging }, drag] = useDrag(() => ({
  //   type: ItemTypes.BOX,
  //   item: data,
  //   end: (item, monitor) => {
  //     const dropResult = monitor.getDropResult();
  //     if (item && dropResult) {
  //       // alert(`You dropped ${item.name} into ${dropResult.name}!`);
  //     }
  //   },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //     handlerId: monitor.getHandlerId(),
  //   }),
  // }));
  // const opacity = isDragging ? 0 : 1; //灵魂出窍时，本尊透明度

  const [drawerVis, setDrawerVis] = useState({
    deal: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);
  const getbgColor = () => {
    let color = "";
    switch (data.status) {
      case "2":
        color = "rgb(135, 208, 104, 0.2)";
        break;

      case "3":
        color = "rgba(214, 66, 54,0.2)";
        break;

      case "4":
        color = "rgba(253, 216, 53,0.2)";
        break;

      default:
        color = "#fff";
        break;
    }
    return color;
  };
  const getColor = () => {
    let color = "";
    switch (data.status) {
      case "2":
        color = "rgb(135, 208, 104, 1)";
        break;

      case "3":
        color = "rgba(214, 66, 54, 1)";
        break;

      case "4":
        color = "rgba(253, 216, 53,1)";
        break;

      default:
        color = "#fff";
        break;
    }
    return color;
  };

  const getActiveIcon = () => {
    let { todayUndoneCount, undoneCount, overTimeCount } = data;
    if (undoneCount == 0) {
      return <IconFont iconName="icon-test" size="16" />;
    } else if (overTimeCount) {
      return <IconFont iconName="icon-warn1" color="#d81e06" size="16" />;
    } else if (undoneCount) {
      return <IconFont iconName="icon-warn2" color="#119143" size="16" />;
    }
  };

  return (
    <>
      <div
        // ref={drag}
        style={{
          ...style,
          // opacity,
          backgroundColor: getbgColor(),
        }}
        data-testid={`box`}
        onClick={() => {
          setOperateId(data.id);
          setOperateTxt(data.orgName);
          setDrawerVis({
            ...drawerVis,
            deal: true,
          });
        }}
      >
        <div className="box-warp">
          <div className="box-inner flex-row-base">
            <div className="left">
              <span className="title">{data?.title}</span>
              <div>{data?.orgName}</div>
              <div>
                <span style={{ marginRight: "4px" }}>
                  {data.avatar ? (
                    <Avatar
                      shape="square"
                      src={
                        <Image
                          src={data.avatar}
                          style={{
                            width: 32,
                          }}
                        />
                      }
                    />
                  ) : (
                    <IconFont iconName="ren" size={18}></IconFont>
                  )}
                </span>
                {data.ownerUserName}
                {data.status == "1" || !data.status ? null : (
                  <Tag
                    color={getColor(data)}
                    style={{ margin: "0 4px", borderRadius: "8px" }}
                  >
                    {data.statusName}
                  </Tag>
                )}
                {!data.stayDayCount ? null : (
                  <Tag
                    color="#cf1322"
                    style={{
                      margin: "0 4px",
                      borderRadius: "22px",
                      fontSize: "10px",
                      padding: "0 5px",
                    }}
                  >
                    {data.stayDayCount}d
                  </Tag>
                )}
                {/* <IconFont
                iconName="renminbi"
                size={18}
                color="#d48806"
              ></IconFont> */}
                <Statistic
                  value={data?.value}
                  valueStyle={{ fontSize: "12px" }}
                  prefix={"￥"}
                  // suffix="元"
                />
              </div>
            </div>
            <div className="flex-colum-base flex-align-center right">
              <div className="flex-row-base icon-wrap">{getActiveIcon()}</div>
            </div>
          </div>
        </div>
      </div>
      {drawerVis.deal && (
        <DrawerDeal
          width="1000"
          visible={drawerVis.deal}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              deal: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}
    </>
  );
};
