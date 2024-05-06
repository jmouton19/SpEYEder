function userAuthCompany(
  userId,
  provider,
  accessToken,
  refreshToken,
  expiresIn
) {
  return {
    userId,
    provider,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

module.exports = userAuthCompany;
