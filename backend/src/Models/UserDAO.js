const pool = require("../config/db");
const user = require("./user");

const tableName = "users";

const userDAO = {
  async createUser(email) {
    const { rows } = await pool.query(
      `INSERT INTO ${tableName} (email) VALUES ($1) RETURNING *;`,
      [email]
    );
    if (rows.length === 0) return null;
    return user(rows[0].user_id, rows[0].email, rows[0].created_at);
  },

  async findUserByEmail(email) {
    const { rows } = await pool.query(
      `SELECT * FROM ${tableName} WHERE email = $1;`,
      [email]
    );
    if (rows.length === 0) return null;
    return user(rows[0].user_id, rows[0].email, rows[0].created_at);
  },
  async findUserById(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM ${tableName} WHERE user_id = $1;`,
      [userId]
    );
    if (rows.length === 0) return null;
    return user(rows[0].user_id, rows[0].email, rows[0].created_at);
  },
};

module.exports = userDAO;
