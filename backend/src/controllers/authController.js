const querystring = require("querystring");
const https = require("https");
const jwt = require("jsonwebtoken");
const userDAO = require("../models/userDAO");
const sessionDAO = require("../models/sessionDAO");
const userAuthCompanyDAO = require("../models/userAuthCompanyDAO");
const provider = require("../models/provider");
const config = require("../config");

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

        let user = await userDAO.findUserByEmail(email);
        if (!user) {
          user = await userDAO.createUser(email);
        }
        const existingAuth =
          await userAuthCompanyDAO.findUserAuthCompanyByUserIdAndProvider(
            user.userId,
            provider.GOOGLE
          );
        if (!existingAuth.length) {
          await userAuthCompanyDAO.updateUserAuthCompany(
            user.userId,
            provider.GOOGLE,
            access_token,
            refresh_token,
            new Date(Date.now() + expires_in * 1000)
          );
        } else {
          await userAuthCompanyDAO.addUserAuthCompany(
            user.userId,
            provider.GOOGLE,
            access_token,
            refresh_token,
            new Date(Date.now() + expires_in * 1000)
          );
        }

        const expTime = 30 * 24 * 60 * 60;
        const session = await sessionDAO.createSession(
          user.userId,
          new Date(Date.now() + expTime * 1000)
        );

        res.cookie("sessionID", session.sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: expTime * 1000, // 30 days in milliseconds
        });
        res.cookie("loggedIn", true, {
          httpOnly: false,
          secure: true,
          sameSite: "None",
          maxAge: expTime * 1000, // 30 days in milliseconds
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

const logout = async (req, res) => {
  const sessionId = req.session.sessionId;

  try {
    await sessionDAO.deleteSession(sessionId);

    res.clearCookie("sessionID", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("loggedIn", false, {
      httpOnly: false,
      secure: true,
      sameSite: "None",
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Logout failed:", error);
    res.status(500).json({ message: "Failed to logout." });
  }
};

module.exports = logout;

module.exports = {
  logout,
  login,
  googleAuthCallback,
};
