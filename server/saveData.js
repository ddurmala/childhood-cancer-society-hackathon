require("dotenv").config();
const db = require("./db");

const saveTrade = async (trade) => {
    try {
        console.log("🔍 Saving Trade ->", trade);

        let formattedDate;

        if (trade.timestamp) {
            try {
                formattedDate = trade.timestamp.split(" ")[0]; // Extract YYYY-MM-DD
            } catch (error) {
                console.warn("🚨 Warning: Invalid timestamp format, using default date.");
                formattedDate = new Date().toISOString().split("T")[0]; // Fallback to today's date
            }
        } else {
            console.warn("🚨 Warning: Timestamp missing! Using default date.");
            formattedDate = new Date().toISOString().split("T")[0];
        }

        console.log("✅ Formatted date:", formattedDate);

        // 🛑 No need for getTime() - formattedDate is already a string (YYYY-MM-DD)

        const query = `
    INSERT INTO public.swaps (exchange, amount_in, amount_out, token_in, token_out, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6)
`;

        const values = [
            "Uniswap V2",  // Now correctly counted as parameter 1
            parseFloat(trade.amount_in) || 0,
            parseFloat(trade.amount_out) || 0,
            trade.token_sold_symbol || 'UNKNOWN',
            trade.token_bought_symbol || 'UNKNOWN',
            trade.timestamp
        ];

        await db.query(query, values);

        console.log("✅ Trade saved successfully:", trade);
    } catch (error) {
        console.error("❌ Error inserting trade:", error);
    }
};

const savePriceAnalysis = async (analysis) => {
    try {
        console.log("🔍 Saving Price Analysis ->", analysis);

        const query = `
            INSERT INTO price_analysis (timestamp, uniswap_price, binance_mid_price, price_difference)
            VALUES ($1, $2, $3, $4)
        `;

        const values = [
            analysis.timestamp,
            parseFloat(analysis.uniswap_price) || 0,
            parseFloat(analysis.binance_mid_price) || 0,
            parseFloat(analysis.price_difference) || 0
        ];

        await db.query(query, values);
        console.log("✅ Price Analysis saved successfully:", analysis);
    } catch (error) {
        console.error("❌ Error inserting price analysis:", error);
    }
};

module.exports = { saveTrade, savePriceAnalysis };
