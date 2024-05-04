const https = require("https");
const { pwnedApiKey } = require("../config/config");

const checkPwned = (req, res) => {
  const email = req.query.email || req.user.email;
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
