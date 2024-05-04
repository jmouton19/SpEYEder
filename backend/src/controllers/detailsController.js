const https = require("https");
const config = require("../Config");
const { cleanGmailProfileData } = require("../utils/gmailProfileDataCleaner");

const getGoogleUserData = (req, res) => {
  const accessToken = req.cookies.accessToken;

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
    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => {
      if (response.statusCode === 200) {
        const formattedData = cleanGmailProfileData(JSON.parse(data));
        res.json(formattedData);
        //res.json(JSON.parse(data));
      } else {
        console.error(`Failed to fetch user data: ${data}`);
        res.status(500).json({ message: "Failed to fetch user data" });
      }
    });
  });

  request.on("error", (error) => {
    console.error("Error fetching user data from Google People API:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  });

  request.end();
};

module.exports = {
  getGoogleUserData,
};
