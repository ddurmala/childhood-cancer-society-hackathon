require("dotenv").config();
const { fetchBinanceTrades } = require("./fetchBinanceTrades");
const { saveTrade } = require("./saveData");

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const CUSTOM_ENDPOINT_URL = "https://api.dune.com/api/v1/endpoints/ddurmala/uniswapv2/results";

async function fetchUniswapV2Swaps() {
    console.log("🔄 Fetching Uniswap V2 swaps from Dune Custom Endpoint...");

    try {
        const response = await fetch(`${CUSTOM_ENDPOINT_URL}?limit=100`, {
            headers: { "X-Dune-API-Key": DUNE_API_KEY }
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        const swaps = data.result.rows;

        if (!swaps || swaps.length === 0) {
            console.warn("⚠️ No swaps found for Uniswap V2.");
            return;
        }

        for (let swap of swaps) {
            console.log("🛠 DEBUG: Swap Data ->", swap);

            await saveTrade(
                "Uniswap V2",
                parseFloat(swap.amount_in),
                parseFloat(swap.amount_out),
                swap.token_in,
                swap.token_out,
                swap.gas_used ? parseFloat(swap.gas_used) : 0,
                swap.block_time
            );
        }

        console.log(`✅ Successfully fetched & saved ${swaps.length} Uniswap V2 swaps.`);
    } catch (error) {
        console.error("❌ Error fetching Uniswap V2 swaps:", error);
    }
}

async function fetchAllData() {
    console.log("🚀 Fetching all swap data...");

    console.log("🚀 Fetching both Uniswap V2 and Binance trades...");
    await fetchUniswapV2Swaps();
    await fetchBinanceTrades();
    console.log("✅ All trade data fetched.");
}

if (require.main === module) {
    fetchAllData().then(() => {
        console.log("✅ Finished fetching all data!");
        process.exit(0);
    }).catch((err) => {
        console.error("❌ Error fetching data:", err);
        process.exit(1);
    });
}


module.exports = { fetchAllData, fetchUniswapV2Swaps };
