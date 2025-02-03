import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, Button, Box } from "@mui/material";
import authVerification from "../../custom-hooks/authVerification";
import Hamburger from "../../components/Sidebar/Hamburger";
import SalesMonthlyDailyReports from "../Reports/SalesMonthlyDailyReports";

const Dashboard = () => {
  authVerification();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 7));

  return (
    <>
      {/* DRAWER */}
      <Hamburger />

      {/* DASHBOARD */}
      <Box>
        <h1>Dashboarddddddddddddddd</h1>

        <div
          className="sales-monthly-report"
          style={{ width: "500px", height: "500px" }}
        >
          <SalesMonthlyDailyReports date={date} />
        </div>
      </Box>
    </>
  );
};

export default Dashboard;
