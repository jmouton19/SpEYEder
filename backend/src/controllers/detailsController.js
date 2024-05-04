const https = require("https");
const { cleanGmailProfileData } = require("../utils/gmailProfileDataCleaner");
const userAuthCompanyDAO = require("../models/userAuthCompanyDAO");
const provider = require("../models/provider");
const { refreshGoogleTokens } = require("../utils/refreshGoogleTokens");

const getGoogleUserData = async (req, res) => {
  const userId = req.session.userId;
  let accessToken = "";

  try {
    const authDetails =
      await userAuthCompanyDAO.findUserAuthCompanyByUserIdAndProvider(
        userId,
        provider.GOOGLE
      );

    if (!authDetails || new Date() >= new Date(authDetails.expiresIn)) {
      if (!authDetails) {
        return res
          .status(401)
          .json({ message: "Google authentication required." });
      }
      accessToken = await refreshGoogleTokens(userId, authDetails.refreshToken);
    } else {
      accessToken = authDetails.accessToken;
    }

    const options = {
      hostname: "people.googleapis.com",
      path: "/v1/people/me?personFields=addresses,ageRanges,biographies,birthdays,emailAddresses,genders,locales,names,nicknames,occupations,organizations,phoneNumbers,photos,urls",
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const request = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        if (response.statusCode === 200) {
          const formattedData = cleanGmailProfileData(JSON.parse(data));
          res.json(formattedData);
        } else {
          res.status(500).json({ message: "Failed to fetch user data" });
        }
      });
    });

    request.on("error", (error) => {
      res.status(500).json({ error: "Failed to fetch user data" });
    });

    request.end();
  } catch (error) {
    res.status(500).json({ message: "Error processing your request" });
  }
};

module.exports = {
  getGoogleUserData,
};
