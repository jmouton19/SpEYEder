const { Pool } = require("pg");
const config = require("./index");

const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
