require("dotenv").config();
const { saveTrade } = require("./saveData");

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const CUSTOM_ENDPOINT_URL = "https://api.dune.com/api/v1/endpoints/ddurmala_team/uniswapv2/results";

console.log("🔍 DUNE_API_KEY:", process.env.DUNE_API_KEY);

async function fetchJanuary2024Data() {
    console.log("🔄 Fetching January 2024 swaps from Dune Custom Endpoint...");

    try {
        const response = await fetch(`${CUSTOM_ENDPOINT_URL}?limit=5`, {
            headers: { "X-Dune-API-Key": DUNE_API_KEY }
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        const swaps = data.result.rows;

        if (!swaps || swaps.length === 0) {
            console.warn("⚠️ No swaps found for January 2024.");
            return;
        }

        for (let swap of swaps) {
            console.log("🛠 DEBUG: Swap Data ->", swap);

            const dateOnly = swap.timestamp ? swap.timestamp.split(" ")[0] : "1970-01-01";

            const amountIn = parseFloat(swap.amount_in) || 0;
            const amountOut = parseFloat(swap.amount_out) || 0;
            const amountUSD = parseFloat(swap.amount_usd) || 0;

            await saveTrade({
                amount_in: amountIn,
                amount_out: amountOut,
                amount_usd: amountUSD,
                timestamp: dateOnly,
                token_sold_symbol: swap.token_in,
                token_bought_symbol: swap.token_out
            });
        }

        console.log(`✅ Successfully fetched & saved ${swaps.length} Uniswap V2 swaps for January 2024.`);
    } catch (error) {
        console.error("❌ Error fetching Uniswap V2 swaps:", error);
    }
}

if (require.main === module) {
    fetchJanuary2024Data().then(() => {
        console.log("✅ Finished fetching January 2024 data!");
        process.exit(0);
    }).catch((err) => {
        console.error("❌ Error fetching data:", err);
        process.exit(1);
    });
}

module.exports = { fetchJanuary2024Data };
