import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const SwapChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/swap-prices") // Fetch new swap data
            .then((response) => response.json())
            .then((data) => {
                const tradeSizes = data.map((swap) => swap.trade_size);
                const pricesUniswap = data.map((swap) => swap.exchange === "Uniswap V2" ? swap.price : null);
                const pricesBinance = data.map((swap) => swap.exchange === "Binance" ? swap.price : null);

                setChartData({
                    labels: tradeSizes, // Trade size in USD as X-axis
                    datasets: [
                        {
                            label: "Uniswap V2",
                            data: pricesUniswap,
                            borderColor: "blue",
                            borderWidth: 2,
                            pointRadius: 5,
                        },
                        {
                            label: "Binance",
                            data: pricesBinance,
                            borderColor: "green",
                            borderWidth: 2,
                            pointRadius: 5,
                        },
                    ],
                });
            })
            .catch((error) => console.error("Error fetching swap data:", error));
    }, []);

    if (!chartData) return <p>Loading chart...</p>;

    return (
        <div>
            <h2>Trade Size vs. Average Cost</h2>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                        title: { display: true, text: "Trade Size vs. Average Cost" },
                    },
                    scales: {
                        x: { title: { display: true, text: "Trade Size (USD)" } },
                        y: { title: { display: true, text: "Price (USDT per WETH)" } },
                    },
                }}
            />
        </div>
    );
};

export default SwapChart;
