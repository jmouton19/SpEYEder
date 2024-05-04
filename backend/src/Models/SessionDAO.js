const pool = require("../Config/db");

const tableName = "sessions";

const SessionDAO = {
  async createSession(userId, expiresAt, data = null) {
    const { rows } = await pool.query(
      `INSERT INTO ${tableName} (user_id, expires_at, data)
            VALUES ($1, $2, $3) RETURNING *;`,
      [userId, expiresAt, data]
    );
    return rows[0];
  },

  async getSessionById(sessionId) {
    const { rows } = await pool.query(
      `SELECT * FROM ${tableName} WHERE session_id = $1;`,
      [sessionId]
    );
    return rows[0];
  },

  async deleteSession(sessionId) {
    await pool.query(`DELETE FROM ${tableName} WHERE session_id = $1;`, [
      sessionId,
    ]);
  },
};

module.exports = SessionDAO;
