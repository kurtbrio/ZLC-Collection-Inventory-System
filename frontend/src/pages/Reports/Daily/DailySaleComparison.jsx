import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { CircularProgress } from "@mui/material";

const DailySaleComparison = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);

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
        position: "right",
        labels: {
          boxWidth: 30,
          padding: 10,
        },
      },
    },
  };

  const isNoDataAvailable =
    !chartData.datasets[0]?.data ||
    chartData.datasets[0]?.data.every((item) => item === 0);

  return (
    <div className="text-center flex flex-col w-full h-full p-2 gap-4">
      <h1>Daily Sales Comparison</h1>
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
