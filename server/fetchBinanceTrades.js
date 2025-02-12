require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const db = require("./db");

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const DUNE_QUERY_URL = `https://api.dune.com/api/v1/query/4709743/results`; // ✅ Use your query ID

async function fetchBinanceTrades() {
    try {
        console.log("🔄 Fetching Binance trades from Dune...");

        const response = await fetch(DUNE_QUERY_URL, {
            headers: { "X-Dune-API-Key": DUNE_API_KEY },
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        const trades = data.result.rows;

        if (!trades || trades.length === 0) {
            console.warn("⚠️ No Binance trades found.");
            return;
        }

        let rowCount = 0;

        for (let trade of trades) {
            rowCount++;

            const timestamp = trade.timestamp.split(" ")[0]; // ✅ Extract YYYY-MM-DD
            const amountIn = parseFloat(trade.amount_in); // ✅ Trade size
            const amountOut = parseFloat(trade.amount_out); // ✅ Quote price

            console.log(`🔍 Processing trade ${rowCount}:`, {
                timestamp, amountIn, amountOut
            });

            // ✅ Insert into swaps table
            await db.query(
                `INSERT INTO swaps (exchange, amount_in, amount_out, token_in, token_out, timestamp)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT DO NOTHING`,
                ["Binance", amountIn, amountOut, "WETH", "USDT", timestamp]
            );
        }

        console.log(`✅ Successfully inserted ${rowCount} Binance trades.`);
    } catch (error) {
        console.error("❌ Error fetching Binance trades:", error);
    }
}

fetchBinanceTrades();
