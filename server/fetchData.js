require("dotenv").config();
const { AlphaRouter } = require('@uniswap/smart-order-router');
const { Token, CurrencyAmount, TradeType, ChainId } = require('@uniswap/sdk-core');
const { ethers } = require('ethers');

// ✅ Load Infura RPC URL from .env
const INFURA_RPC_URL = process.env.INFURA_RPC_URL;
if (!INFURA_RPC_URL) {
    throw new Error("❌ INFURA_RPC_URL is missing from .env file!");
}

// ✅ Create Ethereum Provider
const provider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);

// ✅ Use Correct Checksummed Ethereum Token Addresses
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // ✅ Fixed
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // ✅ Already correct

// ✅ Define Tokens
const WETH = new Token(ChainId.MAINNET, WETH_ADDRESS, 18, "WETH", "Wrapped Ether");
const USDT = new Token(ChainId.MAINNET, USDT_ADDRESS, 6, "USDT", "Tether");

// ✅ Set Up Uniswap Router
const router = new AlphaRouter({ chainId: ChainId.MAINNET, provider });

/**
 * Fetch Uniswap swap price using the Uniswap SDK.
 * @param {String} amount - Amount of WETH to swap (in Ether)
 * @returns {Object} Swap price details
 */
async function fetchUniswapSwap(amount) {
    try {
        const wethAmount = CurrencyAmount.fromRawAmount(WETH, ethers.utils.parseUnits(amount, 18).toString());

        const route = await router.route(
            wethAmount,
            USDT,
            TradeType.EXACT_INPUT
        );

        if (!route) {
            console.error("❌ No Uniswap route found");
            return null;
        }

        console.log("✅ Uniswap Swap Found:", JSON.stringify(route, null, 2));

        return {
            amountOut: route.quote.toFixed(6),
            gasEstimate: route.estimatedGasUsed.toString(),
        };
    } catch (error) {
        console.error("❌ Error fetching Uniswap swap:", error);
        return null;
    }
}

module.exports = { fetchUniswapSwap };
