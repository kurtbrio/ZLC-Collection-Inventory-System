const express = require("express");
const router = express.Router();
const { getMonthlyDailyReports } = require("../controllers/reportsController");

router.post("/monthly-daily", getMonthlyDailyReports);

module.exports = router;
