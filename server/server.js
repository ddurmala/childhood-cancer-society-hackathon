require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { fetchUniswapV3Swap, fetchUniswapV2Swaps, fetchCowswapSwaps } = require("./fetchData");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ **Test Route**
app.get("/", (req, res) => {
    res.send("✅ Backend is running!");
});

// ✅ **Fetch & Save a Uniswap V3 Swap**
app.get("/uniswap-swap", async (req, res) => {
    try {
        const amount = req.query.amount || "1"; // Default to 1 WETH if no amount is specified
        console.log(`🔄 Fetching Uniswap V3 Swap for ${amount} WETH...`);

        const swapData = await fetchUniswapV3Swap(amount);

        if (!swapData) {
            return res.status(404).json({ message: "No Uniswap data found." });
        }

        res.json({ message: "✅ Uniswap V3 swap fetched & saved successfully!", swapData });
    } catch (error) {
        console.error("❌ Error fetching Uniswap V3 swap:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// ✅ **Fetch & Save Uniswap V2 and Cowswap Swaps**
app.get("/fetch-all-swaps", async (req, res) => {
    try {
        console.log("🔄 Fetching Uniswap V2 and Cowswap swaps...");

        await fetchUniswapV2Swaps();
        await fetchCowswapSwaps();

        res.json({ message: "✅ Successfully fetched and saved swaps from Uniswap V2 & Cowswap!" });
    } catch (error) {
        console.error("❌ Error fetching swaps:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// ✅ **Retrieve All Saved Swaps**
app.get("/uniswap-swaps", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM uniswap_swaps ORDER BY timestamp DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error retrieving swaps:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// ✅ **Start Server**
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
