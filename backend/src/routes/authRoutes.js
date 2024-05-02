const express = require("express");
const {
  googleAuth,
  googleAuthCallback,
  refreshAccessToken,
} = require("../controllers/authController");

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.post("/refresh", refreshAccessToken);

module.exports = router;
