import React, { useState } from "react";
import BarChartDailyReport from "./BarChartDailyReport";

const DailyReport = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  return (
    <div className="flex flex-col gap-5">
      <form className="flex items-center gap-5">
        <label className="text-highlight">Daily</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </form>

      <div className="grid grid-cols-3">
        <div className="grid-item col-span-3 ">
          <BarChartDailyReport date={date} />
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
