const db = require("./db");

function saveTrade(exchange, amountUSD, realized_price, timestamp) {
    db.run("INSERT INTO swaps (exchange, amountUSD, realized_price, timestamp) VALUES (?, ?, ?, ?)",
        [exchange, amountUSD, realized_price, timestamp], (err) => {
            if (err) {
                console.error("Error inserting trade:", err);
            }
        });
}

module.exports = { saveTrade };
