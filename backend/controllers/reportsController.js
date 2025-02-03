const mongoose = require("mongoose");
const Sales = require("../models/sales");

const getDailyReports = async (date) => {
  const start = new Date(date.setUTCHours(0, 0, 0, 0));
  const end = new Date(date.setUTCHours(23, 59, 59, 999));

  const data = await Sales.find({
    date: { $gte: start, $lte: end },
  });

  const totalPrice = data.reduce((sum, sale) => sum + sale.totalPrice, 0);

  return totalPrice;
};

exports.getMonthlyDailyReports = async (req, res) => {
  const { year, month } = req.body;
  const reports = [];

  try {
    const lastDayOfMonth = new Date(Date.UTC(year, month, 0));

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDay = new Date(Date.UTC(year, month - 1, day));
      const dailySale = await getDailyReports(currentDay);

      reports.push({ date: currentDay.toISOString().split("T")[0], dailySale });
    }

    return res.json({ reports });
  } catch (error) {
    return res.status(400).json({ error: "Server Error" });
  }
};
