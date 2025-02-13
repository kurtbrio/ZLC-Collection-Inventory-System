import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import CircularProgress from "@mui/material/CircularProgress";

const MonthlySaleByType = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSalesReport = async () => {
    try {
      const [year, month] = date.split("-");

      const response = await axios.post("/api/reports/monthly", {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
      });

      const data = response.data.reports;

      const salesByType = data.reduce((acc, report) => {
        for (const type in report.salesByType) {
          if (!acc[type]) {
            acc[type] = 0;
          }
          acc[type] += report.salesByType[type].totalPrice;
        }
        return acc;
      }, {});

      setChartData({
        labels: Object.keys(salesByType),
        datasets: [
          {
            label: "Sales",
            data: Object.values(salesByType),
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
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
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
      <h2 className="text-xl">Monthly Sales by Type</h2>
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

export default MonthlySaleByType;
