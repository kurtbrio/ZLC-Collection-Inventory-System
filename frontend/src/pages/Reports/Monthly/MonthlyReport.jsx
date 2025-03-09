import React, { useState, useEffect } from "react";
import LineChartMonthlyReport from "./LineChartMonthlyReport";
import MonthlySaleComparison from "./MonthlySaleComparison";
import MonthlySaleByType from "./MonthlySaleByType";
import MonthlyTopSellers from "./MonthlyTopSellers";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const MonthlyReport = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 7));
  const [hasSales, setHasSales] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [year, month] = date.split("-");

      const response = await axios.post("/api/reports/hasSales", {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
      });

      setHasSales(response.data.hasSales);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  return (
    <>
      <div className="flex flex-col gap-5">
        <form className="flex items-center gap-5">
          <label className="text-highlight">Monthly</label>
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().slice(0, 7)}
          />
        </form>

        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <CircularProgress color="inherit" />
          </div>
        ) : hasSales ? (
          <div className="grid grid-cols-3 gap-5">
            <div className="grid-item col-span-3">
              <LineChartMonthlyReport date={date} />
            </div>
            <div className="grid-item col-span-3 lg:col-span-1 h-72">
              <MonthlySaleComparison date={date} />
            </div>
            <div className="grid-item col-span-3 lg:col-span-1 h-72">
              <MonthlySaleByType date={date} />
            </div>
            <div className="grid-item col-span-3 lg:col-span-1 h-72">
              <MonthlyTopSellers date={date} />
            </div>
          </div>
        ) : (
          <p className="text-red-700 text-center">
            No data available. Try selecting a different date range.
          </p>
        )}
      </div>
    </>
  );
};

export default MonthlyReport;
