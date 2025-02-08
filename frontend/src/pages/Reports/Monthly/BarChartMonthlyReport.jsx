import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const BarChartMonthlyReport = ({ date }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const fetchSalesReport = async () => {
    try {
      const [year, month] = date.split("-");

      const response = await axios.post("/api/reports/monthly", {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
      });

      const data = response.data.reports;

      console.log(data);

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
    <div className="h-full w-full">
      {chartData.labels.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default BarChartMonthlyReport;
