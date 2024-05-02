const { OAuth2Client } = require("google-auth-library");
const config = require("../config");

const client = new OAuth2Client(config.googleClientId);

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.sendStatus(401);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();
    req.user = payload;
    next();
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    return res.sendStatus(403);
  }
};

module.exports = authenticateToken;
