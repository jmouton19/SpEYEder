const express = require("express");
const {
  googleAuth,
  googleAuthCallback,
  refreshIDToken,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.post("/refresh", refreshIDToken);
router.post("/logout", logout);

module.exports = router;
