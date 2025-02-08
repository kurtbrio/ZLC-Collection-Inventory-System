import React, { useState } from "react";
import Hamburger from "../../../components/Sidebar/Hamburger";
import BarChartMonthlyReport from "./BarChartMonthlyReport";
import MonthlySaleComparison from "./MonthlySaleComparison";
import MonthlySaleByType from "./MonthlySaleByType";

const MonthlyReport = () => {
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
              <div className="grid-item col-span-3">
                <BarChartMonthlyReport date={date} />
              </div>
              <div className="grid-item col-span-3 lg:col-span-1">
                <MonthlySaleComparison date={date} />
              </div>
              <div className="grid-item col-span-3 lg:col-span-2">
                <MonthlySaleByType date={date} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyReport;
