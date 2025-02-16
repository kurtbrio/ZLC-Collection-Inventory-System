const express = require("express");
const router = express.Router();
const {
  getDailyReport,
  getMonthlyReport,
  getYearlyReport,
  getTopSellers,
  hasSales,
} = require("../controllers/reportsController");

router.post("/daily", getDailyReport);
router.post("/monthly", getMonthlyReport);
router.post("/yearly", getYearlyReport);
router.post("/top", getTopSellers);
router.post("/hasSales", hasSales);

module.exports = router;
