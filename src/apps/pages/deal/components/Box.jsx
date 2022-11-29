import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
import IconFont from "@Components/IconFont";
import "./index.less";
const style = {};
export const Box = function Box({ data }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: data,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));
  const opacity = isDragging ? 0 : 1; //灵魂出窍时，本尊透明度
  return (
    <div ref={drag} style={{ ...style, opacity }} data-testid={`box`}>
      <div className="box-warp">
        <div className="box-inner flex-row-base">
          <div className="left">
            <div>{data?.title}</div>
            <div>{data?.org_name}</div>
            <div>{data?.currency}</div>
          </div>
          <div className="flex-colum-base flex-align-center right">
            <div className="flex-row-base icon-wrap">
              <IconFont iconName="icon-test " size="16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
