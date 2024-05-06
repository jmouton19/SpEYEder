const express = require("express");
const {
  login,
  googleAuthCallback,
  logout,
} = require("../controllers/authController");
const authenticateSession = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/login", login);
router.get("/google/callback", googleAuthCallback);
router.post("/logout", authenticateSession, logout);

module.exports = router;
