import React, { useEffect, useState } from "react";

import { Descriptions, DatePicker } from "antd";
import { saleDashboard as saleDashboardApi } from "@Api/analyse_staff";
import { useParams } from "react-router-dom";
import SdTitle from "@Components/SdTitle";
import moment from "moment";

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
  return (
    <div>
      <SdTitle title="我的销售">
        <DatePicker picker="year" onChange={onChange} />
      </SdTitle>
      <Descriptions title={null}>
        {data.map((item, idx) => {
          return item.map((jtem, jdx) => (
            <Descriptions.Item label={jtem.label} key={idx + "-" + jdx}>
              {jtem.value}
            </Descriptions.Item>
          ));
        })}
      </Descriptions>
    </div>
  );
}

export default Desript;
