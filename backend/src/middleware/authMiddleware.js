const { OAuth2Client } = require("google-auth-library");
const config = require("../config");

const client = new OAuth2Client(config.googleClientId);

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && authHeader.split(" ")[1]; // Assumes "Bearer <token>"

  const tokenFromCookie = req.cookies.idToken;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No authentication token provided." });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();
    req.user = payload; // Attach user info to the request object
    next(); // Pass control to the next middleware function
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
