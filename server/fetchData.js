require("dotenv").config();
const { fetchBinanceTrades } = require("./fetchBinanceTrades");
const { saveTrade } = require("./saveData");

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const CUSTOM_ENDPOINT_URL = "https://api.dune.com/api/v1/endpoints/ddurmala/uniswapv2/results";

async function fetchUniswapV2Swaps(month, year) {
    console.log("🔄 Fetching Uniswap V2 swaps from Dune Custom Endpoint...");

    if (!month || !year) {
        console.error("❌ Month and year must be specified for fetching swaps.");
        return;
    }

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
            console.warn("⚠️ No swaps found for the selected month and year.");
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
    console.log(`🚀 Fetching all swap data for ${month}/${year}...`);

    if (!month || !year) {
        console.error("❌ Month and year must be provided.");
        return;
    }

    console.log("🚀 Fetching both Uniswap V2 and Binance trades...");
    await fetchUniswapV2Swaps(month, year);
    await fetchBinanceTrades(month, year);
    console.log("✅ All trade data fetched.");

    // Ensure this runs only if executed directly
    if (require.main === module) {
        const month = process.argv[2]; // Get month from CLI argument
        const year = process.argv[3];  // Get year from CLI argument

        fetchAllData(month, year).then(() => {
            console.log("✅ Finished fetching all data!");
            process.exit(0);
        }).catch((err) => {
            console.error("❌ Error fetching data:", err);
            process.exit(1);
        });
    }
}


module.exports = { fetchAllData, fetchUniswapV2Swaps };
