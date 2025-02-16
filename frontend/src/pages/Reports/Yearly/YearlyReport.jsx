import React, { useState, useEffect } from "react";
import LineChartYearlyReport from "./LineChartYearlyReport";
import YearlySaleComparison from "./YearlySaleComparison";
import YearlySaleByType from "./YearlySaleByType";
import YearlyTopSellers from "./YearlyTopSellers";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const YearlyReport = () => {
  const [date, setDate] = useState(new Date().getFullYear());
  const [hasSales, setHasSales] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const incrementYear = () => {
    setDate((prev) => Math.min(prev + 1, new Date().getFullYear()));
  };

  const decrementYear = () => {
    setDate((prev) => prev - 1);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/reports/hasSales", {
        year: parseInt(date, 10),
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
          <label className="text-highlight">Yearly</label>

          <button
            type="button"
            onClick={decrementYear}
            className="w-6 h-6 rounded-full flex justify-center items-center border-white/20 border-1"
          >
            -
          </button>
          <input
            type="number"
            value={date}
            readOnly
            className="text-center w-30"
          />
          <button
            type="button"
            onClick={incrementYear}
            className="w-6 h-6 rounded-full flex justify-center items-center border-white/20 border-1"
          >
            +
          </button>
        </form>

        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <CircularProgress color="inherit" />
          </div>
        ) : hasSales ? (
          <div className="grid grid-cols-3 gap-5">
            <div className="grid-item col-span-3">
              <LineChartYearlyReport date={date} />
            </div>
            <div className="grid-item col-span-3 lg:col-span-1">
              <YearlySaleComparison date={date} />
            </div>
            <div className="grid-item col-span-3 lg:col-span-1">
              <YearlySaleByType date={date} />
            </div>
            <div className="grid-item col-span-3 lg:col-span-1">
              <YearlyTopSellers date={date} />
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

export default YearlyReport;
