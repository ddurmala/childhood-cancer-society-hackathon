require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { fetchUniswapSwap } = require("./fetchData");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// ✅ Corrected: Add Uniswap swap endpoint
app.get("/uniswap-swap", async (req, res) => {
    const amount = req.query.amount;
    if (!amount) {
        return res.status(400).json({ error: "Missing amount parameter" });
    }

    console.log(`🔄 Fetching Uniswap swap for ${amount} WETH...`);
    try {
        const swapData = await fetchUniswapSwap(amount);

        if (!swapData) {
            return res.status(404).json({ error: "No Uniswap swap data found." });
        }

        res.json({ message: "Uniswap swap fetched successfully!", swapData });
    } catch (error) {
        console.error("❌ Error fetching Uniswap swap:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
