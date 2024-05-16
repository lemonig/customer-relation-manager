import React, { useEffect, useState } from "react";

import { Descriptions, DatePicker, Tooltip } from "antd";
import { saleDashboard as saleDashboardApi } from "@Api/analyse_staff";
import { useParams } from "react-router-dom";
import SdTitle from "@Components/SdTitle";
import moment from "moment";
import { InfoCircleFilled } from "@ant-design/icons";

function Desript() {
  const { id } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData(moment().year());
  }, []);

  const onChange = (value, dateString) => {
    getPageData(dateString);
  };
  async function getPageData(year) {
    if (!id) {
      return;
    }
    let res = await saleDashboardApi({
      year,
      userId: id,
    });

    setData(res.data);
  }

  const $descLabel = (val) => (
    <>
      <span>{val.label}</span>
      <Tooltip title={val.description}>
        <span style={{ fontSize: "14px", cursor: "pointer" }}>
          <InfoCircleFilled />
        </span>
      </Tooltip>
    </>
  );
  return (
    <div>
      <SdTitle title="我的销售">
        <DatePicker picker="year" onChange={onChange} defaultValue={moment()} />
      </SdTitle>
      <Descriptions title={null}>
        {data.map((item, idx) => {
          return item.map((jtem, jdx) => (
            <Descriptions.Item label={$descLabel(jtem)} key={idx + "-" + jdx}>
              {jtem.value}
            </Descriptions.Item>
          ));
        })}
      </Descriptions>
    </div>
  );
}

export default Desript;
