require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());

const { fetchAllData } = require("./fetchData");

const PORT = process.env.PORT || 3001;

const db = require("./db");

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
    try {
        const result = await db.query(`
            SELECT exchange, 
                   amount_out AS trade_size, 
                   amount_out / amount_in AS price
            FROM swaps
            WHERE token_in = 'WETH' AND token_out = 'USDT'
            ORDER BY trade_size
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error fetching swap prices:", error);
        res.status(500).json({ error: "Failed to fetch swap prices" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
