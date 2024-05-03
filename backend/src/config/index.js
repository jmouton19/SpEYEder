require("dotenv").config();

const config = {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  pwnedApiKey: process.env.PWNED_API_KEY,
};

module.exports = config;
