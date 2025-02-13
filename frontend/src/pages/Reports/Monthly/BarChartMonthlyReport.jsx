import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const BarChartMonthlyReport = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSalesReport = async () => {
    try {
      const [year, month] = date.split("-");

      const response = await axios.post("/api/reports/monthly", {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
      });

      const data = await response.data.reports;

      setChartData({
        labels: data.map((report) => report.date),
        datasets: [
          {
            label: "Sales",
            data: data.map((report) => report.totalSale),
            backgroundColor: "#ada282",
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
  };

  return (
    <div className="text-center flex flex-col w-full h-full p-2 gap-4">
      <h1>
        Sales of{" "}
        {new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </h1>
      <div className="w-full h-full">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <>
            {chartData.labels.length > 0 ? (
              <Bar data={chartData} options={options} />
            ) : (
              <p className="text-red-700">No sales available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BarChartMonthlyReport;
