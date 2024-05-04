const querystring = require("querystring");
const https = require("https");
const jwt = require("jsonwebtoken");
const UserDAO = require("../Models/UserDAO");
const SessionDAO = require("../Models/SessionDAO");
const UserAuthCompanyDAO = require("../Models/UserAuthCompanyDAO");
const Provider = require("../Models/Provider");
const config = require("../Config");

const oneDayInMs = 24 * 60 * 60 * 1000;
const oneHrInMs = 60 * 60 * 1000;

const login = (req, res) => {
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

  const tokenRequest = https.request(tokenOptions, async (tokenResponse) => {
    let data = "";
    tokenResponse.on("data", (chunk) => {
      data += chunk;
    });
    tokenResponse.on("end", async () => {
      try {
        const { id_token, refresh_token, access_token, expires_in } =
          JSON.parse(data);
        const decoded = jwt.decode(id_token);
        const email = decoded.email;

        let user = await UserDAO.findUserByEmail(email);
        if (!user) {
          user = await UserDAO.createUser(email);
        }
        const existingAuth =
          await UserAuthCompanyDAO.findSocialCompaniesByUserIdAndProvider(
            user.userId,
            Provider.GOOGLE
          );
        if (existingAuth.length > 0) {
          await UserAuthCompanyDAO.updateUserAuthCompany(
            user.userId,
            Provider.GOOGLE,
            access_token,
            refresh_token,
            new Date(Date.now() + expires_in * 1000)
          );
        } else {
          await UserAuthCompanyDAO.addUserAuthCompany(
            user.userId,
            Provider.GOOGLE,
            access_token,
            refresh_token,
            new Date(Date.now() + expires_in * 1000)
          );
        }

        const session = await SessionDAO.createSession(
          user.userId,
          new Date(Date.now() + expires_in * 1000)
        );

        res.cookie("sessionID", session.sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        });

        res.redirect(`${config.frontendUrl}`);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
      }
    });
  });

  tokenRequest.on("error", (e) => {
    console.error(e);
    res.status(500).json({ error: "Login failed" });
  });

  tokenRequest.write(values);
  tokenRequest.end();
};

const logout = (req, res) => {
  res.cookie("idToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });

  res.sendStatus(200);
};

module.exports = {
  logout,
  login,
  googleAuthCallback,
};
