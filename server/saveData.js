require("dotenv").config();
const db = require("./db");

const saveTrade = async (trade) => {
    try {
        console.log("🔍 Saving Trade ->", trade);

        let formattedDate = trade.timestamp ? trade.timestamp.split(" ")[0] : new Date().toISOString().split("T")[0];

        // ✅ Fix token symbols: ensure they are correctly saved
        const tokenSoldSymbol = (trade.token_sold_symbol || "").trim().toUpperCase();
        const tokenBoughtSymbol = (trade.token_bought_symbol || "").trim().toUpperCase();


        if (!tokenSoldSymbol || !tokenBoughtSymbol) {
            console.warn("🚨 Warning: Missing token symbols!", { tokenSoldSymbol, tokenBoughtSymbol });
        }

        console.log(`🔹 Saving with Tokens: ${tokenSoldSymbol} -> ${tokenBoughtSymbol}`);

        const query = `
            INSERT INTO public.swaps (exchange, amount_in, amount_out, token_in, token_out, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        const values = [
            trade.exchange || "Unknown Exchange",
            parseFloat(trade.amount_in) || 0,
            parseFloat(trade.amount_out) || 0,
            tokenSoldSymbol || 'UNKNOWN',  // ✅ Ensure token names are correctly stored
            tokenBoughtSymbol || 'UNKNOWN',
            formattedDate
        ];

        await db.query(query, values);

        console.log("✅ Trade saved successfully:", { exchange: trade.exchange, tokenSoldSymbol, tokenBoughtSymbol, formattedDate });
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
