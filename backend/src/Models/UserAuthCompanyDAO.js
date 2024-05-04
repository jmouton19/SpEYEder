const pool = require("../config/db");
const userAuthCompany = require("./userAuthCompany");

const tableName = "user_auth_companies";

const userAuthCompanyDAO = {
  async addUserAuthCompany(
    userId,
    providerId,
    accessToken,
    refreshToken,
    expiresIn
  ) {
    const { rows } = await pool.query(
      `INSERT INTO ${tableName} (user_id, provider_id, access_token, refresh_token, expires_in)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
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

  async updateUserAuthCompany(
    userId,
    providerId,
    accessToken,
    refreshToken,
    expiresIn
  ) {
    const { rows } = await pool.query(
      `UPDATE ${tableName} SET 
     access_token = $3, 
     refresh_token = $4, 
     expires_in = $5
     WHERE user_id = $1 AND provider_id = $2
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
