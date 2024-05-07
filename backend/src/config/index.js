require("dotenv").config();

const config = {
  // Server port
  port: process.env.PORT || 8080,

  // Google OAuth settings
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,

  // GitHub OAuth settings
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubRedirectUri: process.env.GITHUB_REDIRECT_URI,

  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL,

  // API Keys
  pwnedApiKey: process.env.PWNED_API_KEY,

  // Database connection settings
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
  },
};

module.exports = config;
