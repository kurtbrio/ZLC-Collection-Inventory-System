import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const YearlySaleComparison = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);

  const getPreviousYear = (year) => {
    const prevYearDate = new Date(Date.UTC(year - 1, 0, 1))
      .toISOString()
      .slice(0, 4);

    return prevYearDate;
  };

  const fetchSalesData = async () => {
    setIsLoading(true);

    try {
      const prevYear = getPreviousYear(date);

      const responseCurrent = await axios.post("/api/reports/yearly", {
        year: parseInt(date, 10),
      });

      const responsePrevious = await axios.post("/api/reports/yearly", {
        year: parseInt(prevYear, 10),
      });

      const currentYearSales = responseCurrent.data.reports.reduce(
        (total, report) => total + report.totalSale,
        0
      );

      const previousYearSales = responsePrevious.data.reports.reduce(
        (total, report) => total + report.totalSale,
        0
      );

      setChartData({
        labels: [`${date} Sales`, `${prevYear} Sales`],
        datasets: [
          {
            label: "Sales",
            data: [currentYearSales, previousYearSales],
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
      <h1>Yearly Sales Comparison</h1>
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

export default YearlySaleComparison;
