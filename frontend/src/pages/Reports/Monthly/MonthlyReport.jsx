import React, { useState } from "react";
import authVerification from "../../../custom-hooks/authVerification";
import Hamburger from "../../../components/Sidebar/Hamburger";
import BarChartMonthlyReport from "./BarChartMonthlyReport";
import CompareMonthlyReport from "./CompareMonthlyReport";

const MonthlyReport = () => {
  authVerification();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 7));

  return (
    <>
      <div className="full">
        <Hamburger />
        <div className="container">
          <div className="flex flex-col gap-5">
            <form className="flex items-center gap-5">
              <label>Monthly</label>
              <input
                type="month"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </form>

            <div className="grid grid-cols-3 gap-5 pb-10">
              <div className="col-span-3 lg:col-span-2" id="grid-item">
                <BarChartMonthlyReport date={date} />
              </div>
              <div className="col-span-3 lg:col-span-1 " id="grid-item">
                <CompareMonthlyReport date={date} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyReport;
