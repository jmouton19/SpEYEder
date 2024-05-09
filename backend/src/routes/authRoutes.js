const express = require("express");
const {
  login,
  googleAuthCallback,
  logout,
  authGithub,
  githubAuthCallback,
  checkSession,
} = require("../controllers/authController");
const authenticateSession = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/login", login);
router.get("/google/callback", googleAuthCallback);

router.get("/github", authenticateSession, authGithub);
router.get("/github/callback", githubAuthCallback);
router.get("/session", authenticateSession, checkSession);
router.post("/logout", authenticateSession, logout);

module.exports = router;
