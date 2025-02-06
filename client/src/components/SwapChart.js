import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const SwapChart = () => {
    const [chartData, setChartData] = useState({ uniswap: [], binance: [] });

    useEffect(() => {
        fetch("http://localhost:3001/swap-prices")
            .then((response) => response.json())
            .then((data) => {
                const uniswapData = data
                    .filter((swap) => swap.exchange === "Uniswap V2" && (swap.trade_size < 14700 || swap.trade_size > 27000))
                    .map((swap) => ({
                        x: swap.trade_size,
                        y: swap.price,
                    }));

                const binanceData = data
                    .filter((swap) => swap.exchange === "Binance" && (swap.trade_size < 14700 || swap.trade_size > 27000))
                    .map((swap) => ({
                        x: swap.trade_size,
                        y: swap.price,
                    }));

                setChartData({ uniswap: uniswapData, binance: binanceData });
            })
            .catch((error) => console.error("Error fetching swap data:", error));
    }, []);

    if (!chartData.uniswap.length || !chartData.binance.length) return <p>Loading chart...</p>;

    return (
        <div style={{ width: "100%", textAlign: "center", padding: "20px" }}>
            <h2>Uniswap Swap Data</h2>
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>Trade Size vs. Average Cost</p>
            <p style={{ fontSize: "14px", color: "#777" }}>Data from January 2024</p>

            <Plot
                data={[
                    {
                        x: chartData.uniswap.map((d) => d.x),
                        y: chartData.uniswap.map((d) => d.y),
                        mode: "markers",
                        type: "scatter",
                        name: "Uniswap V2",
                        marker: { color: "blue", size: 6 },
                    },
                    {
                        x: chartData.binance.map((d) => d.x),
                        y: chartData.binance.map((d) => d.y),
                        mode: "markers",
                        type: "scatter",
                        name: "Binance",
                        marker: { color: "green", size: 6 },
                    },
                ]}
                layout={{
                    title: "Trade Size vs. Average Cost",
                    xaxis: {
                        title: { text: "Trade Size in USD", font: { size: 16, color: "#333" } }, // ✅ X-Axis Label
                        type: "log",
                        tickvals: [50, 100, 200, 300, 500, 1000, 2000, 5000, 10000],
                        ticktext: ["50", "100", "200", "300", "500", "1k", "2k", "5k", "10k"],
                        showgrid: true,
                    },
                    yaxis: {
                        title: { text: "Average Cost (USDT per WETH)", font: { size: 16, color: "#333" } }, // ✅ Y-Axis Label
                        tickformat: "$,.2f",
                        showgrid: true,
                        zeroline: false,
                    },
                    legend: { x: 0, y: -0.2, orientation: "h" },
                    margin: { t: 50, b: 80, l: 80, r: 20 },
                    plot_bgcolor: "white",
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: "100%", height: "500px" }}
            />
        </div>
    );
};

export default SwapChart;
