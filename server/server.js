require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());

const { fetchAllData } = require("./fetchData");

const PORT = process.env.PORT || 3001;

const db = require("./db");

app.get("/", (req, res) => {
    res.send("Welcome to the Swap Data Fetcher API");
});

app.get("/fetch-all", async (req, res) => {
    console.log("🔄 Received request to fetch Uniswap V2 & Binance trades...");
    try {
        await fetchAllData();
        res.json({ message: "✅ Successfully fetched & saved Uniswap V2 & Binance swaps!" });
    } catch (error) {
        console.error("❌ Error in API route:", error);
        res.status(500).json({ error: "Failed to fetch swaps" });
    }
});

app.get("/swap-prices", async (req, res) => {
    const { month, year } = req.query;

    console.log(`🛠 API received request → month: ${month}, year: ${year}`);

    if (!month || !year) {
        return res.status(400).json({ error: "Month and year are required!" });
    }

    console.log(`🔍 Fetching swap data for ${month}/${year}`);

    try {
        const result = await db.query(
            `SELECT * FROM swaps WHERE EXTRACT(MONTH FROM timestamp) = $1 AND EXTRACT(YEAR FROM timestamp) = $2`,
            [month, year]
        );

        if (!result.rows.length) {
            console.warn(`No data found for ${month}/${year}`);
        }

        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error fetching swap prices:", error);
        res.status(500).json({ error: "Failed to fetch swap prices" });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
