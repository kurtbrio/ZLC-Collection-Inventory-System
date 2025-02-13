import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const MonthlySaleComparison = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);

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
        labels: [`${prevDate} Sales`, `${date} Sales`],
        datasets: [
          {
            label: "Sales",
            data: [currentMonthSales, previousMonthSales],
            backgroundColor: ["#ada282", "#5c5c5c"],
          },
        ],
      });

      setIsLoading(false);
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
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 30,
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="text-center flex flex-col w-full h-full p-2 gap-4">
      <h2 className="flex flex-col text-xl">
        Monthly Sales Comparison
        <span>
          ({date} vs {getPreviousMonth(date)})
        </span>
      </h2>
      <div className="w-full h-full">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <>
            {chartData.labels.length > 0 ? (
              <Pie data={chartData} options={options} />
            ) : (
              <p className="text-red-700">No sales available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlySaleComparison;
