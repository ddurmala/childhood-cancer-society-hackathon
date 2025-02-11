require("dotenv").config();
const { fetchBinanceTrades } = require("./fetchBinanceTrades");
const { saveTrade } = require("./saveData");

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const CUSTOM_ENDPOINT_URL = "https://api.dune.com/api/v1/endpoints/ddurmala/uniswapv2/results";

console.log("🔍 DUNE_API_KEY:", process.env.DUNE_API_KEY);


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

async function fetchSwapsForMonth(year, month) {
    console.log(`🔄 Fetching swaps for ${year}-${month}...`);

    try {
        const response = await fetch(`${CUSTOM_ENDPOINT_URL}?month=${month}&year=${year}`, {
            headers: { "X-Dune-API-Key": DUNE_API_KEY }
        });

        const responseText = await response.text();  // Read response as text
        console.log("📜 Raw API Response:", responseText);  // Log raw API response

        const data = JSON.parse(responseText);  // Parse JSON

        if (!response.ok) {
            throw new Error(`❌ API request failed: ${data.message || response.statusText}`);
        }

        if (!data || !data.result || !data.result.rows) {
            throw new Error("❌ No valid data in API response.");
        }

        const swaps = data.result.rows;
        console.log(`✅ Received ${swaps.length} swaps`);

        for (let swap of swaps) {
            console.log("🛠 DEBUG: Swap Data ->", swap);
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

    } catch (error) {
        console.error("❌ Error fetching swaps:", error);
    }
}


async function fetchAllData() {
    const startYear = 2023;
    const endYear = 2024;

    for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
            const monthStr = String(month).padStart(2, '0'); // Ensure format "01", "02"...

            console.log(`Fetching data for ${year}-${monthStr}...`);

            const query = `
                SELECT
    block_time AS timestamp,
    token_sold_amount AS amount_in,
    token_bought_amount AS amount_out,
    token_sold_symbol AS token_in,
    token_bought_symbol AS token_out,
    amount_usd
FROM dex.trades
WHERE block_time BETWEEN TIMESTAMP '2023-01-01 00:00:00' AND TIMESTAMP '2024-12-31 23:59:59'
AND token_sold_symbol = 'WETH'
AND token_bought_symbol = 'USDT'
LIMIT 100000

            `;

            try {
                const response = await fetchDuneData(query); // Replace with your API call function
                console.log(`✅ Data fetched for ${year}-${monthStr}:`, response.length);
            } catch (error) {
                console.error(`❌ Error fetching ${year}-${monthStr}:`, error);
            }
        }
    }
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
