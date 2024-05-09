const { cleanGmailProfileData } = require("../utils/gmailProfileDataCleaner");
const userAuthCompanyDAO = require("../Models/UserAuthCompanyDAO");
const provider = require("../Models/Provider");
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

    const response = await fetch(
      `https://people.googleapis.com/v1/people/me?personFields=addresses,ageRanges,biographies,birthdays,emailAddresses,genders,locales,names,nicknames,occupations,organizations,phoneNumbers,photos,urls`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      const formattedData = cleanGmailProfileData(data);
      res.json(formattedData);
    } else {
      res
        .status(response.status)
        .json({ message: "Failed to fetch user data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

const getGitHubUserData = async (req, res) => {
  const userId = req.session.userId;
  let accessToken = "";

  try {
    const authDetails =
      await userAuthCompanyDAO.findUserAuthCompanyByUserIdAndProvider(
        userId,
        provider.GITHUB
      );

    if (!authDetails) {
      return res
        .status(401)
        .json({ message: "GitHub authentication required." });
    }
    accessToken = authDetails.accessToken;

    const response = await fetch(`https://api.github.com/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "SpEYEder",
      },
    });

    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res
        .status(response.status)
        .json({ message: "Failed to fetch GitHub user data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub user data" });
  }
};

module.exports = {
  getGitHubUserData,
  getGoogleUserData,
};
