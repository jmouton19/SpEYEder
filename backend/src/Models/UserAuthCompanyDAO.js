const pool = require("../Config/db");
const UserAuthCompany = require("./UserAuthCompany");

const tableName = "social_companies";

const UserAuthCompanyDAO = {
  async addUserAuthCompany(
    userId,
    provider,
    accessToken,
    refreshToken,
    expiresIn
  ) {
    const { rows } = await pool.query(
      `INSERT INTO ${tableName} (user_id, provider, access_token, refresh_token, expires_in)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [userId, provider, accessToken, refreshToken, expiresIn]
    );
    const { token_id, user_id, access_token, refresh_token, expires_in } =
      rows[0];

    return new UserAuthCompany(
      token_id,
      user_id,
      provider,
      access_token,
      refresh_token,
      expires_in
    );
  },
  async findSocialCompaniesByUserIdAndProvider(userId, provider) {
    const { rows } = await pool.query(
      `SELECT * FROM ${tableName} WHERE user_id = $1 AND provider = $2;`,
      [userId, provider]
    );
    return rows.map((row) => {
      const {
        token_id,
        user_id,
        provider,
        access_token,
        refresh_token,
        expires_in,
      } = row;
      return new UserAuthCompany(
        token_id,
        user_id,
        provider,
        access_token,
        refresh_token,
        expires_in
      );
    });
  },
};

module.exports = UserAuthCompanyDAO;
