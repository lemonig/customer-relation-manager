import React from "react";
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

function OverView() {
  return (
    <div className="overview-wrap">
      <div className="chart-wrap">
        <CalendarChart />
      </div>
      <div style={{ padding: "0 5%" }}>
        <Descript />
        <Table1 />
        <Table2 />
        <Table3 />
        <Table4 />
        <Table5 />
      </div>
    </div>
  );
}

export default OverView;
