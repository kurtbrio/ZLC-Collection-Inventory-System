import React, { useState } from "react";
import authVerification from "../../custom-hooks/authVerification";
import Hamburger from "../../components/Sidebar/Hamburger";
import BarChartMonthlyReport from "../Reports/Monthly/BarChartMonthlyReport";

const Dashboard = () => {
  authVerification();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 7));

  return (
    <>
      <div className="full">
        <Hamburger />
        <div className="container">
          <h1 className="text-xl">Dashboard</h1>

          <div>
            <BarChartMonthlyReport date={date} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
