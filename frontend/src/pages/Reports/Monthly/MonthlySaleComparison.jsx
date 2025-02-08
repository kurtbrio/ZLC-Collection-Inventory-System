import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import axios from "axios";

const MonthlySaleComparison = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const getPreviousMonth = (currentDate) => {
    const [year, month] = currentDate.split("-").map(Number);
    let prevYear = year;
    let prevMonth = month - 1;

    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }

    return `${prevYear}-${String(prevMonth).padStart(2, "0")}`;
  };

  const fetchSalesData = async () => {
    try {
      const prevDate = getPreviousMonth(date);
      const [year, month] = date.split("-");
      const [prevYear, prevMonth] = prevDate.split("-");

      const responseCurrent = await axios.post("/api/reports/monthly", {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
      });

      const responsePrevious = await axios.post("/api/reports/monthly", {
        year: parseInt(prevYear, 10),
        month: parseInt(prevMonth, 10),
      });

      const currentMonthSales = responseCurrent.data.reports.reduce(
        (total, report) => total + report.totalSale,
        0
      );

      const previousMonthSales = responsePrevious.data.reports.reduce(
        (total, report) => total + report.totalSale,
        0
      );

      setChartData({
        labels: [`${date} Sales`, `${prevDate} Sales`],
        datasets: [
          {
            label: "Monthly Sales Comparison",
            data: [currentMonthSales, previousMonthSales],
            backgroundColor: ["#ada282", "#5c5c5c"],
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [date]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="flex flex-col text-center">
        Monthly Sales Comparison
        <span>
          ({date} vs {getPreviousMonth(date)})
        </span>
      </h2>
      <div>
        {chartData.labels.length > 0 ? (
          <Pie data={chartData} options={options} />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default MonthlySaleComparison;
