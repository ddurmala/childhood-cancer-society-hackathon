require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "swap_data_2",
    password: "pass",
    port: 5432,
});

module.exports = pool;