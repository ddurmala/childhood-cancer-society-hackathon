require("dotenv").config();
const { AlphaRouter } = require("@uniswap/smart-order-router");
const { Token, CurrencyAmount, TradeType, ChainId } = require("@uniswap/sdk-core");
const { ethers } = require("ethers");
const db = require("./db");
const fetch = require("node-fetch");

// ✅ Load MetaMask Developer API Key (Infura RPC URL) from .env
const INFURA_RPC_URL = process.env.INFURA_RPC_URL;
if (!INFURA_RPC_URL) {
    throw new Error("❌ INFURA_RPC_URL is missing from .env file!");
}

// ✅ Create Ethereum Provider
const provider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);

// ✅ Uniswap Token Addresses
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

// ✅ Define Tokens
const WETH = new Token(ChainId.MAINNET, WETH_ADDRESS, 18, "WETH", "Wrapped Ether");
const USDT = new Token(ChainId.MAINNET, USDT_ADDRESS, 6, "USDT", "Tether");

// ✅ Set Up Uniswap V3 Router
const router = new AlphaRouter({ chainId: ChainId.MAINNET, provider });

/**
 * ✅ Fetch Uniswap V3 Swap & Store in DB
 */
async function fetchUniswapV3Swap(amount) {
    try {
        console.log(`🔄 Fetching Uniswap V3 Swap for ${amount} WETH...`);
        const wethAmount = CurrencyAmount.fromRawAmount(WETH, ethers.utils.parseUnits(amount, 18).toString());

        const route = await router.route(wethAmount, USDT, TradeType.EXACT_INPUT);
        if (!route) {
            console.error("❌ No Uniswap V3 route found");
            return null;
        }

        const amountOut = route.quote.toFixed(6);
        const gasEstimate = route.estimatedGasUsed.toString();
        const timestamp = new Date().toISOString();

        console.log(`✅ Uniswap V3 Swap Found: ${amount} WETH → ${amountOut} USDT (Gas: ${gasEstimate})`);

        // ✅ Store Swap Data in PostgreSQL
        await db.query(
            `INSERT INTO uniswap_swaps (amount_in, amount_out, token_in, token_out, gas_estimate, timestamp, exchange) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [amount, amountOut, "WETH", "USDT", gasEstimate, timestamp, "Uniswap V3"]
        );

        return { amountOut, gasEstimate };
    } catch (error) {
        console.error("❌ Error fetching Uniswap V3 swap:", error);
        return null;
    }
}


async function fetchUniswapV2Swaps() {
    try {
        console.log("🔄 Fetching Uniswap V2 swaps from Ethereum...");

        const latestBlock = await provider.getBlockNumber();
        const startBlock = latestBlock - 10000; // Last 10,000 blocks

        console.log(`📊 Checking Uniswap V2 swaps from block ${startBlock} to ${latestBlock}`);

        // ✅ Use WETH/USDT Pair Contract (Uniswap V2) — DO NOT CONVERT IT
        const UNISWAP_V2_WETH_USDT_PAIR = "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852";


        // ✅ Define Swap event ABI for Pair Contract
        const iface = new ethers.utils.Interface([
            "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)"
        ]);

        // ✅ Query logs directly from the WETH/USDT pair contract
        const logs = await provider.getLogs({
            address: UNISWAP_V2_WETH_USDT_PAIR,  // ✅ Do NOT use ethers.utils.getAddress()
            fromBlock: startBlock,
            toBlock: latestBlock,
            topics: [ethers.utils.id("Swap(address,uint256,uint256,uint256,uint256,address)")]
        });

        console.log(`✅ Found ${logs.length} Uniswap V2 swaps.`);
        console.log("🔹 First log sample:", logs[0]);

        if (!logs.length) {
            console.warn("⚠️ No Uniswap V2 swaps found. Skipping save.");
            return;
        }

        console.log(`✅ Found ${logs.length} Uniswap V2 swaps.`);

        for (const log of logs) {
            const parsed = iface.parseLog(log);

            const amountIn = ethers.utils.formatUnits(parsed.args.amount0In, 18); // WETH Decimals
            const amountOut = ethers.utils.formatUnits(parsed.args.amount1Out, 6); // USDT Decimals
            const tokenIn = "WETH";
            const tokenOut = "USDT";
            const gasEstimate = 0;
            const timestamp = new Date().toISOString();

            await db.query(
                `INSERT INTO uniswap_swaps (amount_in, amount_out, token_in, token_out, gas_estimate, timestamp, exchange) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [amountIn, amountOut, tokenIn, tokenOut, gasEstimate, timestamp, "Uniswap V2"]
            );
        }

        console.log("✅ Uniswap V2 swaps saved to database!");
    } catch (error) {
        console.error("❌ Error fetching Uniswap V2 swaps:", error);
    }
}

/**
 * ✅ Fetch & Store Cowswap Trades
 */
async function fetchCowswapSwaps() {
    try {
        console.log("🔄 Fetching Cowswap swaps...");

        const response = await fetch("https://api.cow.fi/mainnet/api/v1/trades?limit=5");
        const data = await response.json();

        if (!data || !Array.isArray(data) || data.length === 0) {
            console.warn("⚠️ No Cowswap trades found. Skipping save.");
            return;
        }

        console.log(`✅ Found ${data.length} Cowswap trades.`);

        for (const trade of data) {
            const amountIn = ethers.utils.formatUnits(trade.sellAmount, 18);
            const amountOut = ethers.utils.formatUnits(trade.buyAmount, 6);
            const tokenIn = trade.sellToken;
            const tokenOut = trade.buyToken;
            const timestamp = new Date(parseInt(trade.timestamp) * 1000).toISOString();

            // ✅ Store Swap Data in PostgreSQL
            await db.query(
                `INSERT INTO uniswap_swaps (amount_in, amount_out, token_in, token_out, gas_estimate, timestamp, exchange) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [amountIn, amountOut, tokenIn, tokenOut, "Unknown", timestamp, "Cowswap"]
            );
        }

        console.log("✅ Cowswap swaps saved to database!");
    } catch (error) {
        console.error("❌ Error fetching Cowswap swaps:", error);
    }
}

/**
 * ✅ Fetch Swaps from ALL Exchanges
 */
async function fetchAllSwaps() {
    console.log("🔄 Fetching Uniswap V2 and Cowswap swaps...");
    await fetchUniswapV2Swaps();
    await fetchCowswapSwaps();
    console.log("✅ Successfully fetched & saved swaps from Uniswap V2 & Cowswap!");
}

module.exports = { fetchUniswapV3Swap, fetchUniswapV2Swaps, fetchCowswapSwaps, fetchAllSwaps };
