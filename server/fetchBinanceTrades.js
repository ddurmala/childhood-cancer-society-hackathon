require("dotenv").config();

const fs = require("fs");
const csvParser = require("csv-parser");
const db = require("./db");

const filePath = "../data/ETHUSDT-trades-2024-01.csv"; // ✅ Ensure the correct file path

async function fetchBinanceTrades() {
    try {
        console.log("🔄 STARTING Binance trades fetch...");

        if (!fs.existsSync(filePath)) {
            console.error("❌ CSV file not found at:", filePath);
            return;
        }

        let rowCount = 0;
        const maxRows = 100; // ✅ Change this if needed to process more trades
        let batch = [];

        const stream = fs.createReadStream(filePath)
            .pipe(csvParser({ headers: ["trade_id", "price", "qty", "quote_qty", "time", "is_buyer_maker", "ignore"], skipLines: 1 }));

        return new Promise((resolve, reject) => {
            stream.on("data", async (row) => {
                if (rowCount >= maxRows) {
                    stream.destroy();  // ✅ Stop streaming early if needed
                    return;
                }

                rowCount++;
                console.log(`🔍 Row ${rowCount}:`, row);

                const timestamp = new Date(Number(row.time)); // ✅ Convert timestamp from ms
                const amountIn = parseFloat(row.qty); // ✅ Trade size
                const amountOut = parseFloat(row.quote_qty); // ✅ Realized price

                // ✅ **Check if trade already exists**
                const exists = await tradeExists(timestamp, amountIn, amountOut);
                if (exists) {
                    console.log(`⚠️ Trade at ${timestamp} already exists. Skipping.`);
                    return; // **SKIP INSERTION IF TRADE EXISTS**
                }

                batch.push([
                    "Binance",
                    amountIn,
                    amountOut,
                    "WETH",
                    "USDT",
                    timestamp
                ]);

                if (batch.length >= 5) {
                    await insertBatch(batch);
                    batch = [];
                }
            });

            stream.on("end", async () => {
                if (batch.length > 0) await insertBatch(batch);
                console.log("✅ File processing complete. EXITING.");
                resolve();
            });

            stream.on("error", (err) => {
                console.error("❌ Stream error:", err);
                reject(err);
            });
        });

    } catch (error) {
        console.error("❌ Error fetching Binance trades:", error);
    }
}

// ✅ **Function to Check if Trade Exists in Database**
async function tradeExists(timestamp, amountIn, amountOut) {
    try {
        const result = await db.query(
            `SELECT 1 FROM swaps WHERE timestamp = $1 AND amount_in = $2 AND amount_out = $3 LIMIT 1`,
            [timestamp, amountIn, amountOut]
        );
        return result.rows.length > 0;
    } catch (error) {
        console.error("❌ Error checking if trade exists:", error);
        return false;
    }
}

// ✅ **Batch Insert Function**
async function insertBatch(batch) {
    try {
        const values = batch.flat();
        const placeholders = batch.map((_, i) =>
            `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`
        ).join(", ");

        await db.query(
            `INSERT INTO swaps (exchange, amount_in, amount_out, token_in, token_out, timestamp)
             VALUES ${placeholders}
             ON CONFLICT DO NOTHING`,
            values
        );

        console.log(`✅ Inserted ${batch.length} Binance trades into database.`);
    } catch (error) {
        console.error("❌ Error inserting batch into DB:", error);
    }
}

module.exports = { fetchBinanceTrades };
