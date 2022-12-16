import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./index.less";
import LinkCustomer from "@Shared/LinkCustomer";
import LinkCooprate from "@Shared/LinkCooprate";
import LinkOppnent from "@Shared/LinkOppnent";
import LinkAgent from "@Shared/LinkAgent";

/**
 * url: zb jz hz
 * */

function SelectCompany({ value = {}, onChange, url, text }) {
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (text) {
      setData({
        id: value,
        name: text,
      });
    }
  }, [text]);

  const triggerChange = (changedValue) => {
    console.log(changedValue);
    onChange?.(changedValue.data.id);
  };
  const getRowSelected = (flag, row) => {
    if (flag) {
      setData(row[0]);
      triggerChange({
        data: row[0],
      });
    }
    setOpen(false);
  };

  const switchCoponent = () => {
    if (url === "kh") {
      return (
        <LinkCustomer
          open={open}
          defaultId={value}
          getRowSelected={getRowSelected}
          url={url}
        />
      );
    } else if (url === "hz") {
      return (
        <LinkCooprate
          open={open}
          defaultId={value}
          getRowSelected={getRowSelected}
          url={url}
        />
      );
    } else if (url === "jz") {
      return (
        <LinkOppnent
          open={open}
          defaultId={value}
          getRowSelected={getRowSelected}
          url={url}
        />
      );
    } else if (url === "zb") {
      return (
        <LinkAgent
          open={open}
          defaultId={value}
          getRowSelected={getRowSelected}
          url={url}
        />
      );
    } else {
      return (
        <LinkCustomer
          open={open}
          defaultId={value}
          getRowSelected={getRowSelected}
          url={url}
        />
      );
    }
  };

  return (
    <>
      <div className="select-one">
        <Button
          icon={<DownOutlined className="ant-select-arrow" />}
          block
          onClick={() => setOpen(true)}
        >
          {data.name ?? (
            <span className="ant-select-selection-placeholder">请选择</span>
          )}
        </Button>
        {switchCoponent()}
      </div>
    </>
  );
}

export default SelectCompany;
