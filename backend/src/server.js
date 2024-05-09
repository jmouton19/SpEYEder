const express = require("express");
const { json } = require("express");
const pwnedRoutes = require("./routes/pwnedRoutes");
const authRoutes = require("./routes/authRoutes");
const detailsRoutes = require("./routes/detailsRoutes");
const authenticateSession = require("./middleware/authMiddleware");
const { frontendUrl, port } = require("./config");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Middlewares
app.use(json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "StaticFiles")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "StaticFiles", "index.html"));
});

// Routes
app.use("/auth", authRoutes);
app.use("/pwned", authenticateSession, pwnedRoutes);
app.use("/details", authenticateSession, detailsRoutes);

// Test route with authentication middleware
app.get("/test", authenticateSession, (req, res) => {
  res.json({ message: "Authenticated!", user: req.user });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Test api eu API serve" });
});

module.exports = app;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
