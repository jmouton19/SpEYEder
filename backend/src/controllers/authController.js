const querystring = require("querystring");
const https = require("https");
const jwt = require("jsonwebtoken");
const userDAO = require("../models/userDAO");
const sessionDAO = require("../models/sessionDAO");
const userAuthCompanyDAO = require("../models/userAuthCompanyDAO");
const provider = require("../models/provider");
const config = require("../config");

const checkSession = (req, res) => {
  res.sendStatus(200);
};

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
        if (existingAuth) {
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
        res.status(500).json({ error: "Login failed - db" });
      }
    });
  });

  tokenRequest.on("error", (e) => {
    console.error(e);
    res.status(500).json({ error: "Login failed - network" });
  });

  tokenRequest.write(values);
  tokenRequest.end();
};

const authGithub = (req, res) => {
  const rootUrl = "https://github.com/login/oauth/authorize";
  const options = {
    client_id: config.githubClientId,
    redirect_uri: config.githubRedirectUri,
    scope: "user,repo",
    state: "rand", //very random string kappa
  };

  const authUrl = `${rootUrl}?${querystring.stringify(options)}`;
  res.redirect(authUrl);
};

const githubAuthCallback = (req, res) => {
  const { code, state } = req.query;
  const values = querystring.stringify({
    code,
    client_id: config.githubClientId,
    client_secret: config.githubClientSecret,
    redirect_uri: config.githubRedirectUri,
    state,
    grant_type: "authorization_code",
  });

  const tokenOptions = {
    hostname: "github.com",
    path: "/login/oauth/access_token",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const tokenRequest = https.request(tokenOptions, (tokenResponse) => {
    let data = "";
    tokenResponse.on("data", (chunk) => {
      data += chunk;
    });
    tokenResponse.on("end", async () => {
      try {
        const { access_token } = JSON.parse(data);
        const refresh_token = null;

        const userId = req.session.userId;

        const existingAuth =
          await userAuthCompanyDAO.findUserAuthCompanyByUserIdAndProvider(
            userId,
            provider.GITHUB
          );
        if (existingAuth) {
          await userAuthCompanyDAO.updateUserAuthCompany(
            userId,
            provider.GITHUB,
            access_token,
            refresh_token,
            null
          );
        } else {
          await userAuthCompanyDAO.addUserAuthCompany(
            userId,
            provider.GITHUB,
            access_token,
            refresh_token,
            null
            //new Date(Date.now() + expires_in * 1000)
          );
        }

        res.redirect(`${config.frontendUrl}`);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed GitHub Oauth - db" });
      }
    });
  });

  tokenRequest.on("error", (error) => {
    console.error(error);
    res.status(500).json({ error: "Failed GitHub Oauth - network" });
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

module.exports = {
  logout,
  login,
  googleAuthCallback,
  authGithub,
  githubAuthCallback,
  checkSession,
};
