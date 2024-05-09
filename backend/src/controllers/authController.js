const querystring = require("querystring");
const userDAO = require("../Models/UserDAO");
const sessionDAO = require("../Models/SessionDAO");
const userAuthCompanyDAO = require("../Models/UserAuthCompanyDAO");
const provider = require("../Models/Provider");
const config = require("../config");
const jwt = require("jsonwebtoken");

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

const googleAuthCallback = async (req, res) => {
  const { code } = req.query;
  const body = querystring.stringify({
    code,
    client_id: config.googleClientId,
    client_secret: config.googleClientSecret,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Failed to retrieve tokens");

    const { id_token, refresh_token, access_token, expires_in } = data;
    const decoded = jwt.decode(id_token);
    const email = decoded.email;

    let user = await userDAO.findUserByEmail(email);
    if (!user) {
      user = await userDAO.createUser(email);
    }

    const expirationDate = new Date(Date.now() + expires_in * 1000);
    await userAuthCompanyDAO.updateOrCreateUserAuthCompany(
      user.userId,
      provider.GOOGLE,
      access_token,
      refresh_token,
      expirationDate
    );

    const session = await sessionDAO.createSession(user.userId, expirationDate);
    const expTime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    res.cookie("sessionID", session.sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: expTime,
    });

    res.redirect(`${config.frontendUrl}`);
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    res.status(500).json({ error: "Login failed - network/db" });
  }
};

const authGithub = (req, res) => {
  const rootUrl = "https://github.com/login/oauth/authorize";
  const options = {
    client_id: config.githubClientId,
    redirect_uri: config.githubRedirectUri,
    scope: "user,repo",
    state: req.session.sessionId,
  };

  const authUrl = `${rootUrl}?${querystring.stringify(options)}`;
  res.redirect(authUrl);
};

const githubAuthCallback = async (req, res) => {
  const { code, state } = req.query;
  const body = querystring.stringify({
    code,
    client_id: config.githubClientId,
    client_secret: config.githubClientSecret,
    redirect_uri: config.githubRedirectUri,
    state,
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    const data = await response.json();

    if (!response.ok) throw new Error("Failed to retrieve GitHub token");

    const session = await sessionDAO.getValidSessionById(state);

    const { access_token } = data;
    await userAuthCompanyDAO.updateOrCreateUserAuthCompany(
      session.userId,
      provider.GITHUB,
      access_token,
      null,
      null
    );

    res.redirect(`${config.frontendUrl}`);
  } catch (error) {
    console.error("GitHub Auth Callback Error:", error);
    res.status(500).json({ error: "Failed GitHub OAuth - network/db" });
  }
};

const logout = async (req, res) => {
  const sessionId = req.session.sessionId;
  try {
    await sessionDAO.deleteSession(sessionId);
    res.clearCookie("sessionID", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
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
