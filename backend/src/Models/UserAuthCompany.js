class UserAuthCompany {
  constructor(tokenId, userId, provider, accessToken, refreshToken, expiresIn) {
    this.tokenId = tokenId;
    this.userId = userId;
    this.provider = provider;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }
}

module.exports = UserAuthCompany;
