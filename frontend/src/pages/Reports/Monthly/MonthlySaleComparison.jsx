import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const MonthlySaleComparison = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [percentageDiff, setPercentageDiff] = useState(null);

  const getPreviousMonth = (currentDate) => {
    const [year, month] = currentDate.split("-");
    const prevMonthDate = new Date(Date.UTC(year, month - 2, 1))
      .toISOString()
      .slice(0, 7);

    return prevMonthDate;
  };

  const fetchSalesData = async () => {
    setIsLoading(true);

    try {
      const prevDate = getPreviousMonth(date);
      const [currYear, currMonth] = date.split("-");
      const [prevYear, prevMonth] = prevDate.split("-");

      const responseCurrent = await axios.post("/api/reports/monthly", {
        year: parseInt(currYear, 10),
        month: parseInt(currMonth, 10),
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

      const calculatePercentDiff = (newVal, oldVal) => {
        if (oldVal === 0) {
          return setPercentageDiff(100);
        }

        const percentChange = ((newVal - oldVal) / oldVal) * 100;
        return setPercentageDiff(percentChange.toFixed(2));
      };

      calculatePercentDiff(currentMonthSales, previousMonthSales);

      setChartData({
        labels: [`${date} Sales`, `${prevDate} Sales`],
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
        position: "bottom",
        labels: {
          boxWidth: 30,
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="text-center items-center flex flex-col w-full h-full gap-4">
      <div>
        <h1>Monthly Sales Comparison</h1>
        {isLoading ? (
          ""
        ) : (
          <h2
            className={percentageDiff > 0 ? "text-green-500" : "text-red-500"}
          >
            {percentageDiff > 0 ? "+" : ""}
            {percentageDiff + "%"}
          </h2>
        )}
      </div>
      <div className="w-full h-full">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <Pie data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default MonthlySaleComparison;
