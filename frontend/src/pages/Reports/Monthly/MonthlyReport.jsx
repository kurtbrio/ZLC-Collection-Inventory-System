import React, { useState } from "react";
import BarChartMonthlyReport from "./BarChartMonthlyReport";
import MonthlySaleComparison from "./MonthlySaleComparison";
import MonthlySaleByType from "./MonthlySaleByType";
import MonthlyTopSellers from "./MonthlyTopSellers";

const MonthlyReport = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 7));

  return (
    <>
      <div className="flex flex-col gap-5">
        <form className="flex items-center gap-5">
          <label className="text-highlight">Monthly</label>
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </form>

        <div className="grid grid-cols-3 gap-5">
          <div className="grid-item col-span-3">
            <BarChartMonthlyReport date={date} />
          </div>
          <div className="grid-item col-span-3 lg:col-span-1">
            <MonthlySaleComparison date={date} />
          </div>
          <div className="grid-item col-span-3 lg:col-span-1">
            <MonthlySaleByType date={date} />
          </div>
          <div className="grid-item col-span-3 lg:col-span-1">
            <MonthlyTopSellers date={date} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyReport;
