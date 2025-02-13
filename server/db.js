const { Pool } = require("pg");
require("dotenv").config();

const connectionString =
    process.env.NODE_ENV === "production"
        ? process.env.RENDER_DATABASE_URL  // Use the Render database in production
        : process.env.LOCAL_DATABASE_URL; // Use local database when running locally

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
