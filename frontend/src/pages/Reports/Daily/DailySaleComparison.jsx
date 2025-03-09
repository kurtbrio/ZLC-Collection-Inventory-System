import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { CircularProgress } from "@mui/material";

const DailySaleComparison = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [percentageDiff, setPercentageDiff] = useState(null);

  const getPreviousDay = (currentDate) => {
    const [year, month, day] = currentDate.split("-");
    const getPrevDay = new Date(Date.UTC(year, month - 1, day - 1))
      .toISOString()
      .split("T")[0];

    return getPrevDay;
  };

  const fetchSalesData = async () => {
    setIsLoading(true);

    try {
      const yesterday = getPreviousDay(date);
      const [currYear, currMonth, currDay] = date.split("-");
      const [prevYear, prevMonth, prevDay] = yesterday.split("-");

      const responseCurrent = await axios.post("/api/reports/daily", {
        year: parseInt(currYear, 10),
        month: parseInt(currMonth, 10),
        day: parseInt(currDay, 10),
      });

      const responsePrevious = await axios.post("/api/reports/daily", {
        year: parseInt(prevYear, 10),
        month: parseInt(prevMonth, 10),
        day: parseInt(prevDay, 10),
      });

      const calculatePercentDiff = (newVal, oldVal) => {
        if (oldVal === 0) {
          return setPercentageDiff(100);
        }

        const percentChange = ((newVal - oldVal) / oldVal) * 100;
        return setPercentageDiff(percentChange.toFixed(2));
      };

      calculatePercentDiff(
        responseCurrent.data.totalSale,
        responsePrevious.data.totalSale
      );

      setChartData({
        labels: [`${date} Sales`, `${yesterday} Sales`],
        datasets: [
          {
            label: "Sales",
            data: [
              responseCurrent.data.totalSale,
              responsePrevious.data.totalSale,
            ],
            backgroundColor: ["#ada282", "#5c5c5c"],
          },
        ],
      });

      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching sales data:", error);
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
        <h1>Daily Sales Comparison</h1>
        {isLoading ? (
          ""
        ) : (
          <h2
            className={percentageDiff > 0 ? "text-green-500" : "text-red-500"}
          >
            {percentageDiff > 0 ? "+" : ""}
            {percentageDiff}%
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

export default DailySaleComparison;
