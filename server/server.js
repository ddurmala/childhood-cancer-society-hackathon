require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());

const { fetchUniswapV2, fetchUniswapV3 } = require("./fetchData");
const db = require("./db");

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send("Welcome to the Swap Data Fetcher API");
});

app.get("/fetch-all", async (req, res) => {
    console.log("🔄 Received request to fetch Uniswap V2 trades for January 2024...");
    try {
        await fetchUniswapV2();
        await fetchUniswapV3();
        res.json({ message: "✅ Successfully fetched & saved Uniswap V2 swaps for January 2024!" });
    } catch (error) {
        console.error("❌ Error in API route:", error);
        res.status(500).json({ error: "Failed to fetch swaps" });
    }
});

app.get("/swap-prices", async (req, res) => {
    console.log(`🛠 API received request for January 2024 swap data`);

    try {
        const result = await db.query(
            `SELECT
    block_time AS timestamp,
    token_sold_amount AS amount_in,
    token_bought_amount AS amount_out,
    token_sold_symbol AS token_in,
    token_bought_symbol AS token_out
FROM public."dex.trades"
WHERE block_time BETWEEN TIMESTAMP '2024-01-01' AND TIMESTAMP '2024-01-31'
AND token_sold_symbol = 'WETH'
AND token_bought_symbol = 'USDT'
ORDER BY block_time
LIMIT 100
`
        );

        console.log("📊 Database Query Result:", result.rows);

        if (!result.rows.length) {
            console.warn(`⚠️ No data found for January 2024`);
        }

        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error fetching swap prices:", error);
        res.status(500).json({ error: "Failed to fetch swap prices" });
    }
});

app.get("/trade-analysis", async (req, res) => {
    console.log("📊 Fetching trade analysis data...");

    try {
        const query = `
(SELECT timestamp, exchange, amount_out AS trade_size, amount_out / amount_in AS avg_cost
 FROM swaps
 WHERE token_in = 'WETH'
 AND token_out = 'USDT'
 AND exchange = 'Uniswap V2'
 AND timestamp BETWEEN TIMESTAMP '2024-01-01' AND TIMESTAMP '2024-01-31'
 LIMIT 100)
UNION ALL
(SELECT timestamp, exchange, amount_out AS trade_size, amount_out / amount_in AS avg_cost
 FROM swaps
 WHERE token_in = 'WETH'
 AND token_out = 'USDT'
 AND exchange = 'Uniswap V3'
 AND timestamp BETWEEN TIMESTAMP '2024-01-01' AND TIMESTAMP '2024-01-31'
 LIMIT 100)
UNION ALL
(SELECT timestamp, exchange, amount_out AS trade_size, amount_out / amount_in AS avg_cost
 FROM swaps
 WHERE token_in = 'WETH'
 AND token_out = 'USDT'
 AND exchange = 'Binance'
 AND timestamp BETWEEN TIMESTAMP '2024-01-01' AND TIMESTAMP '2024-01-31'
 LIMIT 100)
ORDER BY timestamp;

        `;

        const { rows } = await db.query(query);

        console.log("✅ Trade analysis data fetched.");
        res.json(rows);
    } catch (error) {
        console.error("❌ Error fetching trade analysis data:", error);
        res.status(500).json({ error: "Failed to fetch trade analysis data" });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
