require("dotenv").config();
const { AlphaRouter } = require("@uniswap/smart-order-router");
const { Token, CurrencyAmount, TradeType, ChainId } = require("@uniswap/sdk-core");
const { ethers } = require("ethers");
const db = require("./db");
const fetch = require("node-fetch");

// Load MetaMask Developer API Key from .env
const INFURA_RPC_URL = process.env.INFURA_RPC_URL;
if (!INFURA_RPC_URL) {
    throw new Error("❌ INFURA_RPC_URL is missing from .env file!");
}

// Create Ethereum Provider
const provider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);

// Uniswap Token Addresses
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

// Tokens
const WETH = new Token(ChainId.MAINNET, WETH_ADDRESS, 18, "WETH", "Wrapped Ether");
const USDT = new Token(ChainId.MAINNET, USDT_ADDRESS, 6, "USDT", "Tether");


const router = new AlphaRouter({ chainId: ChainId.MAINNET, provider });

async function fetchMidPrice() {
    try {
        console.log("🔄 Fetching Mid-Price from CoinGecko...");

        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await response.json();

        // Debug
        console.log("🔍 CoinGecko API Response:", data);

        if (!data.ethereum || !data.ethereum.usd) {
            console.error("❌ Error: CoinGecko price data is incomplete.");
            return null;
        }

        const midPrice = data.ethereum.usd;
        console.log(`✅ CoinGecko Mid-Price: ${midPrice.toFixed(6)} USDT`);

        return midPrice.toFixed(6);
    } catch (error) {
        console.error("❌ Error fetching CoinGecko mid-price:", error);
        return null;
    }
}


async function fetchUniswapV3Swap(amount) {
    try {
        console.log(`🔄 Fetching Uniswap V3 Swap for ${amount} WETH...`);
        const wethAmount = CurrencyAmount.fromRawAmount(WETH, ethers.utils.parseUnits(amount, 18).toString());

        const route = await router.route(wethAmount, USDT, TradeType.EXACT_INPUT);
        if (!route) {
            console.error("❌ No Uniswap V3 route found");
            return null;
        }

        const amountOut = parseFloat(route.quote.toFixed(6));
        const gasEstimate = route.estimatedGasUsed.toString();
        const timestamp = new Date().toISOString();

        console.log(`✅ Uniswap V3 Swap: ${amount} WETH → ${amountOut} USDT (Gas: ${gasEstimate})`);

        // Fetch Binance Mid-Price
        const binanceMidPrice = await fetchMidPrice();
        if (!binanceMidPrice) {
            console.warn("⚠️ Skipping Binance price comparison (couldn't fetch mid-price).");
            return { amountOut, gasEstimate };
        }

        // Calculate price difference
        const priceDifference = ((amountOut - binanceMidPrice) / binanceMidPrice) * 100;
        console.log(`Price Difference: ${priceDifference.toFixed(2)}% (vs Binance Mid-Price: ${binanceMidPrice} USDT)`);

        // Store Swap Data in PostgreSQL
        await db.query(
            `INSERT INTO uniswap_swaps (amount_in, amount_out, token_in, token_out, gas_estimate, timestamp, exchange, binance_mid_price, price_difference) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [amount, amountOut, "WETH", "USDT", gasEstimate, timestamp, "Uniswap V3", binanceMidPrice, priceDifference.toFixed(6)]
        );

        console.log("✅ Uniswap V3 swap saved to database!");
        return { amountOut, gasEstimate, binanceMidPrice, priceDifference };
    } catch (error) {
        console.error("❌ Error fetching Uniswap V3 swap:", error);
        return null;
    }
}

//Fetch Swaps from ALL Exchanges

async function fetchAllSwaps() {
    console.log("🔄 Fetching Uniswap V2 and Cowswap swaps...");
    await fetchUniswapV2Swaps();
    await fetchCowswapSwaps();
    console.log("✅ Successfully fetched & saved swaps from Uniswap V2 & Cowswap!");
}

module.exports = { fetchUniswapV3Swap, fetchMidPrice, fetchAllSwaps };
