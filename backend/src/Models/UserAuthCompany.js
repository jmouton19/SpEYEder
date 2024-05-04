function UserAuthCompany(
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

module.exports = UserAuthCompany;
