const express = require("express");
const router = express.Router();
const {
  getSales,
  getSale,
  getProductSales,
  addSale,
  deleteSale,
} = require("../controllers/salesControllers.js");

router.get("/", getSales);
router.get("/:id", getSale);
router.get("product/:id", getProductSales);
router.post("/", addSale);
router.delete("/:id", deleteSale);

module.exports = router;
