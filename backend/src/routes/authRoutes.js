const express = require("express");
const {
  login,
  googleAuthCallback,
  refreshIDToken,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.get("/login", login);
router.get("/google/callback", googleAuthCallback);
router.post("/refresh", refreshIDToken);
router.post("/logout", logout);

module.exports = router;
