import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const SalesMonthlyDailyReports = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const fetchSalesReport = async () => {
    try {
      const [year, month] = date.split("-");

      const response = await axios.post("/api/reports/monthly-daily", {
        year: parseInt(year),
        month: parseInt(month),
      });

      const data = response.data.reports;

      setChartData({
        labels: data.map((report) => report.date),
        datasets: [
          {
            label: "Sales",
            data: data.map((report) => report.dailySale),
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, [date]);

  return (
    <div className="report-chart">
      {chartData.labels.length > 0 ? (
        <Bar data={chartData} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default SalesMonthlyDailyReports;
