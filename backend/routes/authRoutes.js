const express = require("express");
const router = express.Router();
const {
  login,
  register,
  verifyLogin,
  logout,
} = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyLogin);
router.get("/logout", logout);

module.exports = router;
