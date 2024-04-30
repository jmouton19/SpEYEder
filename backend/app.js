require("dotenv").config();
const express = require("express");
const https = require("https");
const querystring = require("querystring");

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
