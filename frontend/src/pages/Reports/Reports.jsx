import React, { useState } from "react";
import MonthlyReport from "./Monthly/MonthlyReport";
import DailyReport from "./Daily/DailyReport";
import YearlyReport from "./Yearly/YearlyReport";
import Hamburger from "../../components/Sidebar/Hamburger";

const Reports = () => {
  const [date, setDate] = useState("monthly");

  return (
    <div className="full">
      <Hamburger />
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col md:flex-row gap-10">
          <h1>Reports</h1>
          <div className="flex flex-col md:flex-row gap-5">
            <button
              className={`btn-primary w-24 ${
                date === "daily" && "bg-highlight !text-main-bg"
              }`}
              onClick={() => setDate("daily")}
            >
              Daily
            </button>
            <button
              className={`btn-primary w-24 ${
                date === "monthly" && "bg-highlight !text-main-bg"
              }`}
              onClick={() => setDate("monthly")}
            >
              Monthly
            </button>
            <button
              className={`btn-primary w-24 ${
                date === "yearly" && "bg-highlight !text-main-bg"
              }`}
              onClick={() => setDate("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>
        <div>
          {date === "daily" ? (
            <DailyReport />
          ) : date === "monthly" ? (
            <MonthlyReport />
          ) : date === "yearly" ? (
            <YearlyReport />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
