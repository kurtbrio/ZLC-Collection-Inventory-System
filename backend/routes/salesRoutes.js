const express = require("express");
const router = express.Router();
const {
  getSales,
  getSale,
  addSale,
  deleteSale,
} = require("../controllers/salesControllers.js");

router.get("/", getSales);
router.get("/:id", getSale);
router.post("/", addSale);
router.delete("/:id", deleteSale);

module.exports = router;
