import React, { useState } from "react";
import authVerification from "../../custom-hooks/authVerification";
import Hamburger from "../../components/Sidebar/Hamburger";
import SalesMonthlyDailyReports from "./SalesMonthlyDailyReports";

const Reports = () => {
  authVerification();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 7));

  return (
    <>
      <Hamburger />
      <form>
        <input
          type="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </form>

      <SalesMonthlyDailyReports date={date} />
    </>
  );
};

export default Reports;
