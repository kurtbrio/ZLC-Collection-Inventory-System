const express = require("express");
const router = express.Router();
const {
  getDailyReport,
  getMonthlyReport,
  getYearlyReport,
  getTopSellers,
} = require("../controllers/reportsController");

router.post("/daily", getDailyReport);
router.post("/monthly", getMonthlyReport);
router.post("/yearly", getYearlyReport);
router.post("/top", getTopSellers);

module.exports = router;
