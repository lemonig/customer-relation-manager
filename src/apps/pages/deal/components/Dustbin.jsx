import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
import { Box } from "./Box";
import "./index.less";
import { reqD } from "../test";

const style = {};
export const Dustbin = ({ data }) => {
  // const [{ canDrop, isOver }, drop] = useDrop(() => ({
  //   accept: ItemTypes.BOX,
  //   drop: () => ({ name: "Dustbin" }),
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //     canDrop: monitor.canDrop(),
  //   }),
  // }));
  // const isActive = canDrop && isOver;
  // let backgroundColor = "#f6f7f8";
  // if (isActive) {
  //   backgroundColor = "#dddede";
  // } else if (canDrop) {
  //   backgroundColor = "#ebebeb";
  // }
  return (
    <div
      // ref={drop}
      // style={{ ...style, backgroundColor }}
      data-testid="dustbin"
      className="dustin-wrap"
    >
      {/* {isActive ? "哎，对了，松开" : "往这里放"}
       */}
      <div className="dustin-inner">
        <div style={{ padding: "8px" }}>
          {data.list.map((item, idx) => (
            <Box key={idx} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
