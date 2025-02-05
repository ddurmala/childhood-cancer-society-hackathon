require("dotenv").config();

const db = require("./db");

async function saveTrade(exchange, amount_in, amount_out, token_in, token_out, gas_used, timestamp) {
    try {
        if (!token_out) {
            console.warn(`⚠️ Missing token_out for trade at ${timestamp}, setting default to 'UNKNOWN'`);
            token_out = "UNKNOWN"; // Default value to prevent NULL errors
        }

        await db.query(
            `INSERT INTO swaps (exchange, amount_in, amount_out, token_in, token_out, gas_used, timestamp) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             ON CONFLICT DO NOTHING`,
            [exchange, amount_in, amount_out, token_in, token_out, gas_used, timestamp]
        );

        console.log(`✅ Trade saved: ${exchange} at ${timestamp}`);
    } catch (err) {
        console.error("❌ Error inserting trade:", err);
    }
}

module.exports = { saveTrade };
