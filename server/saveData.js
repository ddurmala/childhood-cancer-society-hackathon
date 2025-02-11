require("dotenv").config();
const db = require("./db");

const saveTrade = async (trade) => {
    try {
        console.log("🔍 Raw trade timestamp:", trade.timestamp);

        if (!trade.timestamp || trade.timestamp === "undefined") {
            console.warn("🚨 Warning: Timestamp missing! Using default date.");
            trade.timestamp = new Date().toISOString().split("T")[0]; // Use today's date
        }


        const formattedTimestamp = new Date(trade.timestamp).toISOString();
        console.log("✅ Formatted timestamp:", formattedTimestamp);


        if (isNaN(formattedTimestamp.getTime())) {
            console.error("Invalid timestamp:", trade.timestamp);
            return;
        }

        const pgDate = formattedTimestamp.split("T")[0]; // Extracts only YYYY-MM-DD

        const query = `
    INSERT INTO public."dex.trades" (amount_in, amount_out, amount_usd, timestamp, token_sold_symbol, token_bought_symbol)
    VALUES ($1, $2, $3, $4, $5, $6)
`;

        const values = [trade.amount_in, trade.amount_out, trade.amount_usd, pgDate, trade.token_in, trade.token_out];


        await db.query(query, values);

        console.log("✅ Trade saved successfully:", trade);
    } catch (error) {
        console.error("❌ Error inserting trade:", error);
    }
};

module.exports = { saveTrade };
