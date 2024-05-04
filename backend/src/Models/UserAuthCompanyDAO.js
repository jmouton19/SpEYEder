const pool = require("../Config/db");
const UserAuthCompany = require("./UserAuthCompany");

const tableName = "user_auth_companies";

const userAuthCompanyDAO = {
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
    if (rows.length === 0) return null;
    const { user_id, access_token, refresh_token, expires_in } = rows[0];

    return UserAuthCompany(
      user_id,
      provider,
      access_token,
      refresh_token,
      expires_in
    );
  },

  async updateUserAuthCompany(
    userId,
    provider,
    accessToken,
    refreshToken,
    expiresIn
  ) {
    const { rows } = await pool.query(
      `UPDATE ${tableName} SET 
     access_token = $3, 
     refresh_token = $4, 
     expires_in = $5
     WHERE user_id = $1 AND provider = $2
     RETURNING *;`,
      [userId, provider, accessToken, refreshToken, expiresIn]
    );
    if (rows.length === 0) return null;

    const { user_id, access_token, refresh_token, expires_in } = rows[0];

    return UserAuthCompany(
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
    if (rows.length === 0) return [];
    return rows.map((row) => {
      const { user_id, access_token, refresh_token, expires_in } = row;
      return UserAuthCompany(
        user_id,
        provider,
        access_token,
        refresh_token,
        expires_in
      );
    });
  },
};

module.exports = userAuthCompanyDAO;
