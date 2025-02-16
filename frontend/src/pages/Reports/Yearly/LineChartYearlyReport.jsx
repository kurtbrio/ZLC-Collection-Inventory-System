import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const LineChartYearlyReport = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSalesReport = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/reports/yearly", {
        year: parseInt(date, 10),
      });

      const data = response.data.reports;

      setChartData({
        labels: data.map((report) => report.month),
        datasets: [
          {
            label: "Sales",
            data: data.map((report) => report.totalSale),
            backgroundColor: "#ada282",
            borderColor: "#ada282",
          },
        ],
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
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
    elements: {
      line: {
        tension: 0.3,
      },
    },
  };

  return (
    <div className="text-center flex flex-col w-full h-full p-2 gap-4">
      <h1>Sales of {date}</h1>
      <div className="w-full h-full">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default LineChartYearlyReport;
