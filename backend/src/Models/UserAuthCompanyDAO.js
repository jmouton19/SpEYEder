const pool = require("../config/db");
const userAuthCompany = require("./UserAuthCompany");

const tableName = "user_auth_companies";

const userAuthCompanyDAO = {
  async updateOrCreateUserAuthCompany(
    userId,
    providerId,
    accessToken,
    refreshToken,
    expiresIn
  ) {
    const { rows } = await pool.query(
      `INSERT INTO ${tableName} (user_id, provider_id, access_token, refresh_token, expires_in)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, provider_id) DO UPDATE
       SET access_token = EXCLUDED.access_token, 
           refresh_token = EXCLUDED.refresh_token, 
           expires_in = EXCLUDED.expires_in
       RETURNING *;`,
      [userId, providerId, accessToken, refreshToken, expiresIn]
    );

    if (rows.length === 0) return null;

    const { user_id, provider_id, access_token, refresh_token, expires_in } =
      rows[0];

    return userAuthCompany(
      user_id,
      provider_id,
      access_token,
      refresh_token,
      expires_in
    );
  },

  async findUserAuthCompanyByUserIdAndProvider(userId, providerId) {
    const { rows } = await pool.query(
      `SELECT * FROM ${tableName} WHERE user_id = $1 AND provider_id = $2;`,
      [userId, providerId]
    );
    if (rows.length === 0) return null;

    const { user_id, provider_id, access_token, refresh_token, expires_in } =
      rows[0];

    return userAuthCompany(
      user_id,
      provider_id,
      access_token,
      refresh_token,
      expires_in
    );
  },
};

module.exports = userAuthCompanyDAO;
