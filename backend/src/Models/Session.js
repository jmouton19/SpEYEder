function session(sessionId, userId, createdAt, expiresAt, data = null) {
  return {
    sessionId,
    userId,
    createdAt,
    expiresAt,
    data,
  };
}

module.exports = session;
