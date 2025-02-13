const { Pool } = require("pg");
require("dotenv").config();

// Determine which database URL to use
const connectionString =
    process.env.NODE_ENV === "production"
        ? process.env.RENDER_DATABASE_URL // Render production database
        : process.env.LOCAL_DATABASE_URL; // Local development database

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Required for Render
});

// Test database connection
pool.connect()
    .then(() => console.log("✅ Connected to Database!"))
    .catch(err => console.error("❌ Database Connection Error:", err));

module.exports = pool;
