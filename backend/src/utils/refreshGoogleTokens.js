const https = require("https");
const querystring = require("querystring");
const UserAuthCompanyDAO = require("../Models/UserAuthCompanyDAO");
const Provider = require("../Models/Provider");

async function refreshGoogleTokens(userId, refreshToken) {
  const postData = querystring.stringify({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: config.googleClientId,
    client_secret: config.googleClientSecret,
  });

  const options = {
    hostname: "oauth2.googleapis.com",
    path: "/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  return new Promise((resolve, reject) => {
    const tokenRequest = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", async () => {
        if (response.statusCode === 200) {
          try {
            const newTokens = JSON.parse(data);
            await UserAuthCompanyDAO.updateUserAuthCompany(
              userId,
              Provider.GOOGLE,
              newTokens.access_token,
              newTokens.refresh_token || refreshToken,
              new Date(Date.now() + newTokens.expires_in * 1000)
            );
            resolve();
          } catch (error) {
            console.error("Failed to parse tokens:", error);
            reject(error);
          }
        } else {
          try {
            const errorDetails = JSON.parse(data);
            reject(
              new Error(
                errorDetails.error_description ||
                  "Failed to refresh Google token"
              )
            );
          } catch (parseError) {
            reject(new Error("Unknown error while refreshing Google token"));
          }
        }
      });
    });

    tokenRequest.on("error", (error) => {
      console.error("HTTPS request failed:", error);
      reject(error);
    });

    tokenRequest.write(postData);
    tokenRequest.end();
  });
}

module.exports = { refreshGoogleTokens };
