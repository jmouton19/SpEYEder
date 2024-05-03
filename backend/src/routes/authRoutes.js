const express = require("express");
const {
  googleAuth,
  googleAuthCallback,
  refreshIDToken,
} = require("../controllers/authController");

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.post("/refresh", refreshIDToken);

module.exports = router;
