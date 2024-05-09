const { pwnedApiKey } = require("../config");
const userDAO = require("../Models/UserDAO");

const checkPwned = async (req, res) => {
  let email =
    req.query.email || (await userDAO.findUserById(req.session.userId)).email;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(
    email
  )}?truncateResponse=false`;
  const options = {
    method: "GET",
    headers: {
      "user-agent": "SpEYEder",
      "hibp-api-key": pwnedApiKey,
    },
  };

  try {
    const response = await fetch(url, options);
    if (response.status === 404) {
      return res
        .status(404)
        .json({ message: "No breach found for this account." });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error calling Have I Been Pwned API:", error);
    res.status(500).json({ error: "Failed to check account breach status" });
  }
};

module.exports = {
  checkPwned,
};
