const express = require("express");
const { json } = require("express");
const pwnedRoutes = require("./routes/pwnedRoutes");
const authRoutes = require("./routes/authRoutes");
const detailsRoutes = require("./routes/detailsRoutes");
const authenticateSession = require("./middleware/authMiddleware");
const { frontendUrl, port } = require("./config");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Middlewares
app.use(json());
app.use(cookieParser());

// const corsOptions = {
//   origin: frontendUrl,
//   credentials: true, // to allow cookies to be sent
// };
//app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "..", "StaticFiles")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "StaticFiles", "index.html"));
});

// const allowedOrigins = [
//   frontendUrl,
//   "http://d1xn5naza7l094.cloudfront.net/",
//   "http://localhost:8000/",
//   "http://localhost:8000",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

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
