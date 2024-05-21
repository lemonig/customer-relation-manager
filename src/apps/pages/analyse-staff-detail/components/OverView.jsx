import React, { useState } from "react";
// compo
import CalendarChart from "./CalendarChart";
import Descript from "./Descript";
import Table1 from "./Table1";
import Table2 from "./Table2";
import Table3 from "./Table3";
import Table4 from "./Table4";
import Table5 from "./Table5";
// api
import { countByPerson as countByPersonApi } from "@Api/analyse_staff";
import DrawerDeal from "@Shared/DrawerDeal";

function OverView() {
  const [drawerVis, setDrawerVis] = useState({
    deal: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);
  const clickCallback = (txt, id) => {
    setOperateId(id);
    setOperateTxt(txt);
    setDrawerVis({
      ...drawerVis,
      deal: true,
    });
  };
  return (
    <div className="overview-wrap">
      <div className="chart-wrap">
        <CalendarChart />
      </div>
      <div style={{ padding: "0 5%" }}>
        <Descript />
        <Table1 clickCallback={clickCallback} />
        <Table2 clickCallback={clickCallback} />
        <Table3 clickCallback={clickCallback} />
        <Table4 clickCallback={clickCallback} />
        <Table5 clickCallback={clickCallback} />
      </div>
      {drawerVis.deal && (
        <DrawerDeal
          width="800"
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
    </div>
  );
}

export default OverView;
