const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "158692",
  database: "dindin",
});

module.exports = pool;
