const pool = require("../config/db");
const session = require("./Session");
const tableName = "sessions";

const sessionDAO = {
  async createSession(userId, expiresAt, data = null) {
    const { rows } = await pool.query(
      `INSERT INTO ${tableName} (user_id, expires_at, data)
             VALUES ($1, $2, $3) RETURNING *;`,
      [userId, expiresAt, data]
    );
    if (rows.length === 0) return undefined;
    return session(
      rows[0].session_id,
      userId,
      rows[0].created_at,
      expiresAt,
      data
    );
  },

  async getValidSessionById(sessionId) {
    const now = new Date();
    const { rows } = await pool.query(
      `SELECT * FROM ${tableName} WHERE session_id = $1 AND expires_at > $2;`,
      [sessionId, now]
    );
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return session(
      row.session_id,
      row.user_id,
      row.created_at,
      row.expires_at,
      row.data
    );
  },

  async deleteSession(sessionId) {
    await pool.query(`DELETE FROM ${tableName} WHERE session_id = $1;`, [
      sessionId,
    ]);
  },
};

module.exports = sessionDAO;
