require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { fetchAndSaveUniswapSwap } = require("./fetchData");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Fetch & Save Uniswap real-time swap price
app.get("/uniswap-swap", async (req, res) => {
    try {
        const amount = req.query.amount || "1"; // Default to 1 WETH if no amount is specified
        console.log(`🔄 Fetching Uniswap Swap for ${amount} WETH...`);

        const swapData = await fetchAndSaveUniswapSwap(amount);

        if (!swapData) {
            return res.status(404).json({ message: "No Uniswap data found." });
        }

        res.json({ message: "Uniswap swap fetched & saved successfully!", swapData });
    } catch (error) {
        console.error("❌ Error fetching Uniswap swap:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Retrieve all saved swaps
app.get("/uniswap-swaps", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM uniswap_swaps ORDER BY timestamp DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error retrieving swaps:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

//Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
