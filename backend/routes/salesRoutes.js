const express = require("express");
const router = express.Router();
const {
  getSales,
  addSale,
  deleteSale,
} = require("../controllers/salesControllers.js");

router.get("/", getSales);
router.post("/", addSale);
router.delete("/:id", deleteSale);

module.exports = router;
