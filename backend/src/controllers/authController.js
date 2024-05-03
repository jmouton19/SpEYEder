const querystring = require("querystring");
const https = require("https");
const jwt = require("jsonwebtoken");
const config = require("../config");

const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const googleAuth = (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: config.redirectUri,
    client_id: config.googleClientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["openid", "profile", "email"].join(" "),
  };

  const authUrl = `${rootUrl}?${querystring.stringify(options)}`;
  res.redirect(authUrl);
};

const googleAuthCallback = (req, res) => {
  const { code } = req.query;
  const values = querystring.stringify({
    code,
    client_id: config.googleClientId,
    client_secret: config.googleClientSecret,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
  });

  const tokenOptions = {
    hostname: "oauth2.googleapis.com",
    path: "/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const tokenRequest = https.request(tokenOptions, (tokenResponse) => {
    let data = "";
    tokenResponse.on("data", (chunk) => (data += chunk));
    tokenResponse.on("end", () => {
      const { id_token, refresh_token } = JSON.parse(data);
      // Set cookies
      res.cookie("idToken", id_token, {
        httpOnly: true,
        //secure: true,
        sameSite: "None",
        maxAge: 30 * oneDayInMs,
      });
      res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        //secure: true,
        sameSite: "None",
        maxAge: 30 * oneDayInMs,
      });
      res.redirect(`${config.frontendUrl}`);
    });
  });

  tokenRequest.on("error", (e) => {
    console.error(e);
    res.status(500).json({ error: "Authentication failed" });
  });

  tokenRequest.write(values);
  tokenRequest.end();
};

const refreshIDToken = (req, res) => {
  // Retrieve refreshToken from either the cookie or the request body
  const refreshTokenFromBody = req.body.refreshToken;
  const refreshTokenFromCookie = req.cookies?.refreshToken;
  const refreshToken = refreshTokenFromBody || refreshTokenFromCookie;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  const postData = querystring.stringify({
    client_id: config.googleClientId,
    client_secret: config.googleClientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const options = {
    hostname: "oauth2.googleapis.com",
    path: "/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const tokenRequest = https.request(options, (tokenResponse) => {
    let data = "";
    tokenResponse.on("data", (chunk) => {
      data += chunk;
    });
    tokenResponse.on("end", () => {
      try {
        const newTokens = JSON.parse(data);
        if (newTokens.error) {
          throw new Error(newTokens.error_description);
        }

        res.cookie("idToken", newTokens.id_token, {
          httpOnly: true,
          //secure: true,
          sameSite: "None",
          maxAge: 30 * oneDayInMs,
        });
        res.cookie("refreshToken", newTokens.refresh_token || refreshToken, {
          httpOnly: true,
          // secure: true,
          sameSite: "None",
          maxAge: 30 * oneDayInMs,
        });
        //remove
        res.json({
          idToken: newTokens.id_token,
          expiresIn: newTokens.expires_in,
          refreshToken: newTokens.refresh_token || refreshToken,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to refresh token" });
      }
    });
  });

  tokenRequest.on("error", (e) => {
    console.error(e);
    res.status(500).json({ message: "Error refreshing token" });
  });

  tokenRequest.write(postData);
  tokenRequest.end();
};

module.exports = {
  googleAuth,
  googleAuthCallback,
  refreshIDToken,
};
