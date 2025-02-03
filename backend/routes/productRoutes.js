const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", upload.single("file"), addProduct);
router.patch("/:id", upload.single("file"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
