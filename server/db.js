require("dotenv").config();
const { Pool } = require("pg");

// ✅ Load PostgreSQL credentials from .env
const pool = new Pool({
    user: process.env.PG_USER,       // PostgreSQL username
    host: process.env.PG_HOST,       // Usually "localhost"
    database: process.env.PG_DATABASE, // Your database name (swap_data)
    password: process.env.PG_PASSWORD, // Your database password
    port: process.env.PG_PORT || 5432, // Default PostgreSQL port
});

// Check connection
pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL database."))
    .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
