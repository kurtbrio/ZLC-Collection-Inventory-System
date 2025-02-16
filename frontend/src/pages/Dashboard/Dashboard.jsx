import React, { useState } from "react";
import Hamburger from "../../components/Sidebar/Hamburger";
import LineChartMonthlyReport from "../Reports/Monthly/LineChartMonthlyReport";

const Dashboard = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 7));

  return (
    <>
      <div className="full">
        <Hamburger />
        <div className="container">
          <h1 className="text-xl">Dashboard</h1>

          <div>{/* <BarChartMonthlyReport date={date} /> */}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
