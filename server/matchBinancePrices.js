require("dotenv").config();
const db = require("./db");
const { savePriceAnalysis } = require("./saveData");  // ✅ Importing new function

async function matchBinancePrices() {
    console.log("🔄 Matching Uniswap trades with Binance prices...");

    try {
        // ✅ Use SQL JOIN to match prices
        const query = `
            SELECT 
                u.timestamp, 
                u.amount_out / u.amount_in AS uniswap_price,
                b.amount_out / b.amount_in AS binance_mid_price,
                ((u.amount_out / u.amount_in) - (b.amount_out / b.amount_in)) / (b.amount_out / b.amount_in) * 100 AS price_difference
            FROM swaps u
            JOIN swaps b ON DATE(u.timestamp) = DATE(b.timestamp)  -- 🔄 Ensures timestamp match
            WHERE u.exchange = 'Uniswap V2' 
            AND b.exchange = 'Binance'
            ORDER BY u.timestamp DESC
            LIMIT 10;
        `;

        const result = await db.query(query);

        if (result.rows.length === 0) {
            console.warn("⚠️ No matching price data found.");
            return;
        }

        // ✅ Save each price comparison result
        for (let row of result.rows) {
            await savePriceAnalysis(row);
        }

        console.log("✅ Price analysis complete!");

    } catch (error) {
        console.error("❌ Error in price matching:", error);
    }
}

// ✅ Execute if run directly
if (require.main === module) {
    matchBinancePrices()
        .then(() => {
            console.log("✅ Finished price matching!");
            process.exit(0);
        })
        .catch((err) => {
            console.error("❌ Error in execution:", err);
            process.exit(1);
        });
}

module.exports = { matchBinancePrices };
