const pool = require("../Config/db");
const createUser = require("./User");

const tableName = "users";

const UserDAO = {
  async createUser(email) {
    const { rows } = await pool.query(
      `INSERT INTO ${tableName} (email) VALUES ($1) RETURNING *;`,
      [email]
    );
    if (rows.length === 0) return null;
    return createUser(rows[0].user_id, rows[0].email, rows[0].created_at);
  },

  async findUserByEmail(email) {
    const { rows } = await pool.query(
      `SELECT * FROM ${tableName} WHERE email = $1;`,
      [email]
    );
    if (rows.length === 0) return null;
    return createUser(rows[0].user_id, rows[0].email, rows[0].created_at);
  },
};

module.exports = UserDAO;
