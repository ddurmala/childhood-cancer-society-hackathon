require("dotenv").config();
const { saveTrade } = require("./saveData");

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const CUSTOM_ENDPOINT_URL = "https://api.dune.com/api/v1/endpoints/ddurmala/uniswapv2/results";

console.log("🔍 DUNE_API_KEY:", process.env.DUNE_API_KEY);

async function fetchJanuary2024Data() {
    console.log("🔄 Fetching January 2024 swaps from Dune Custom Endpoint...");

    try {
        const response = await fetch(`${CUSTOM_ENDPOINT_URL}?limit=100000`, {
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

            const tokenOut = swap.token_out || 'UNKNOWN';

            await saveTrade(
                "Uniswap V2",
                parseFloat(swap.amount_in),
                parseFloat(swap.amount_out),
                swap.token_in,
                swap.token_out,
                swap.gas_used ? parseFloat(swap.gas_used) : 0,
                swap.block_time,
                parseFloat(swap.amount_usd)
            );
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
