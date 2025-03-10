import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import CircularProgress from "@mui/material/CircularProgress";

const BarChartDailyReport = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDaily = async () => {
    const [year, month, day] = date.split("-");

    try {
      const response = await axios.post("/api/reports/daily", {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
      });

      const data = response.data.saleByType;

      setChartData({
        labels: Object.keys(data),
        datasets: [
          {
            label: "Sales",
            data: Object.values(data),
            backgroundColor: [
              "#ada282",
              "#9c9275",
              "#8b8168",
              "#7a705b",
              "#69604e",
              "#5c5c5c",
            ],
          },
        ],
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDaily();
    setIsLoading(true);
  }, [date]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          color: "#f1f1f1",
        },
      },
      y: {
        grid: {
          color: "#f1f1f1",
        },
      },
    },
  };

  return (
    <div className="text-center flex flex-col w-full h-full p-2 gap-4">
      <h1>
        Sales of{" "}
        {new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h1>
      <div className="w-full h-full">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default BarChartDailyReport;
