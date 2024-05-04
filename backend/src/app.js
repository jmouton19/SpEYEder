const express = require("express");
const { json } = require("express");
const pwnedRoutes = require("./routes/pwnedRoutes");
const authRoutes = require("./routes/authRoutes");
const detailsRoutes = require("./routes/detailsRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const { frontendUrl } = require("./config/config");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares
app.use(json());
app.use(cookieParser());

const corsOptions = {
  origin: frontendUrl,
  credentials: true, // to allow cookies to be sent
};
app.use(cors(corsOptions));

// Routes
app.use("/auth", authRoutes);
app.use("/pwned", authenticateToken, pwnedRoutes);
app.use("/details", authenticateToken, detailsRoutes);

// Test route with authentication middleware
app.get("/test", authenticateToken, (req, res) => {
  res.json({ message: "Authenticated!", user: req.user });
});

module.exports = app;
