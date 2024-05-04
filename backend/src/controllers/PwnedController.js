const https = require("https");
const { pwnedApiKey } = require("../config");
const userDAO = require("../models/userDAO");

const checkPwned = async (req, res) => {
  let email = null;

  if (!req.query.email) {
    email = (await userDAO.findUserById(req.session.userId)).email;
  } else {
    email = req.query.email;
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const options = {
    hostname: "haveibeenpwned.com",
    path: `/api/v3/breachedaccount/${email}?truncateResponse=false`,
    method: "GET",
    headers: {
      "user-agent": "SpEYEder",
      "hibp-api-key": pwnedApiKey,
    },
  };

  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => {
      if (response.statusCode === 404) {
        res.status(404).json({ message: "No breach found for this account." });
      } else {
        res.json(JSON.parse(data));
      }
    });
  });

  request.on("error", (error) => {
    console.error("Error calling Have I Been Pwned API:", error);
    res.status(500).json({ error: "Failed to check account breach status" });
  });

  request.end();
};

module.exports = {
  checkPwned,
};
