const API_URL = "http://localhost:3001";

/**
 * Fetch swap data from the backend
 */
export const fetchSwaps = async () => {
    try {
        const response = await fetch(`${API_URL}/uniswap-swaps`);
        if (!response.ok) throw new Error("Failed to fetch swaps");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching swaps:", error);
        return [];
    }
};

/**
 * Fetch trade analysis data from the backend
 */
export const fetchTradeAnalysis = async () => {
    try {
        const response = await fetch(`${API_URL}/trade-analysis`);
        if (!response.ok) throw new Error("Failed to fetch trade analysis");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching trade analysis:", error);
        return [];
    }
};