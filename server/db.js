const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./trades.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS swaps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exchange TEXT,
        amountUSD REAL,
        realized_price REAL,
        timestamp TEXT
    )`);
});

module.exports = db;
