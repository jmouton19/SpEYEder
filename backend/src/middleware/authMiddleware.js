const config = require("../config");
const sessionDAO = require("../models/sessionDAO");

const authenticateSession = async (req, res, next) => {
  const sessionID = req.cookies.sessionID;

  if (!sessionID) {
    return res.status(401).json({ message: "No session token provided." });
  }

  try {
    const session = await sessionDAO.getSessionById(sessionID);
    if (!session) {
      return res
        .status(403)
        .json({ message: "Invalid or expired session token." });
    }

    req.session = session;
    next(); // Pass control to the next middleware function
  } catch (error) {
    console.error("Error verifying session token:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired session token." });
  }
};

module.exports = authenticateSession;
