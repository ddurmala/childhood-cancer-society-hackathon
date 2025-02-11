require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());

const { fetchAllData } = require("./fetchData");
const db = require("./db");

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send("Welcome to the Swap Data Fetcher API");
});

app.get("/fetch-all", async (req, res) => {
    console.log("🔄 Received request to fetch Uniswap V2 & Binance trades...");
    try {
        await fetchAllData();
        res.json({ message: "✅ Successfully fetched & saved Uniswap V2 & Binance swaps!" });
    } catch (error) {
        console.error("❌ Error in API route:", error);
        res.status(500).json({ error: "Failed to fetch swaps" });
    }
});

app.get("/swap-prices", async (req, res) => {
    let { month, year } = req.query;

    console.log(`🛠 API received request → month: ${month}, year: ${year}`);

    if (!month || !year) {
        return res.status(400).json({ error: "Month and year are required!" });
    }

    // Ensure month is a zero-padded string (e.g., "01", "02", ..., "12")
    month = String(month).padStart(2, '0');

    // Get the last day of the month correctly
    const lastDay = new Date(year, month, 0).getDate();

    const startDate = `${year}-${month}-01 00:00:00`;
    const endDate = `${year}-${month}-${lastDay} 23:59:59`;

    console.log(`🔍 Fetching swap data for ${startDate} to ${endDate}`);

    try {
        const result = await db.query(
            `SELECT 
                timestamp,
                amount_in,
                amount_out,
                token_sold_symbol AS token_in,
                token_bought_symbol AS token_out
            FROM "public"."dex.trades"
            WHERE timestamp BETWEEN $1 AND $2
            AND token_sold_symbol = 'WETH'
            AND token_bought_symbol = 'USDT'
            ORDER BY timestamp ASC
            LIMIT 1000;`,
            [startDate, endDate]
        );

        console.log("📊 Database Query Result:", result.rows);

        if (!result.rows.length) {
            console.warn(`⚠️ No data found for ${month}/${year}`);
        }

        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error fetching swap prices:", error);
        res.status(500).json({ error: "Failed to fetch swap prices" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
