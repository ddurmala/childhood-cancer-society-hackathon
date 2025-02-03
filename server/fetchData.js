require("dotenv").config();

const { AlphaRouter } = require('@uniswap/smart-order-router');
const { Token, CurrencyAmount, TradeType, ChainId } = require('@uniswap/sdk-core');
const { ethers } = require('ethers');
const db = require("./db");

// Infura RPC URL from .env
const INFURA_RPC_URL = process.env.INFURA_RPC_URL;
if (!INFURA_RPC_URL) {
    throw new Error("❌ INFURA_RPC_URL is missing from .env file!");
}

// Ethereum Provider
const provider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);

//Ethereum Token Addresses
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

//Tokens
const WETH = new Token(ChainId.MAINNET, WETH_ADDRESS, 18, "WETH", "Wrapped Ether");
const USDT = new Token(ChainId.MAINNET, USDT_ADDRESS, 6, "USDT", "Tether");

//Uniswap Router Setup
const router = new AlphaRouter({ chainId: ChainId.MAINNET, provider });

/**
 * Fetch Uniswap swap price using the Uniswap SDK.
 * @param {String} amount - Amount of WETH to swap (in Ether)
 * @returns {Object} Swap price details
 */
async function fetchAndSaveUniswapSwap(amount) {
    try {
        console.log(`🔄 Fetching Uniswap Swap for ${amount} WETH...`);

        // Convert input amount 
        const wethAmount = CurrencyAmount.fromRawAmount(WETH, ethers.utils.parseUnits(amount, 18).toString());

        // Fetch swap route from Uniswap
        const route = await router.route(
            wethAmount,
            USDT,
            TradeType.EXACT_INPUT
        );

        if (!route) {
            console.error("❌ No Uniswap route found");
            return null;
        }

        // Extract relevant swap data
        const amountOut = route.quote.toFixed(6);
        const gasEstimate = route.estimatedGasUsed.toString();
        const timestamp = new Date().toISOString();

        console.log(`✅ Uniswap Swap Found: ${amount} WETH → ${amountOut} USDT (Gas: ${gasEstimate})`);

        // Log data before inserting into DB
        console.log("📝 Inserting into DB:", {
            amount_in: amount,
            amount_out: amountOut,
            token_in: "WETH",
            token_out: "USDT",
            gas_estimate: gasEstimate,
            timestamp: timestamp,
        });

        // Store Swap Data in PostgreSQL
        await db.query(
            `INSERT INTO uniswap_swaps (amount_in, amount_out, token_in, token_out, gas_estimate, timestamp) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [amount, amountOut, "WETH", "USDT", gasEstimate, timestamp]
        );

        console.log("✅ Swap data saved to database!");

        return { amountOut, gasEstimate };
    } catch (error) {
        console.error("❌ Error fetching Uniswap swap:", error);
        return null;
    }
}

module.exports = { fetchAndSaveUniswapSwap };
