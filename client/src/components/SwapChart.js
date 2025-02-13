import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Button } from "react-bootstrap";
import html2canvas from "html2canvas";

import { fetchTradeAnalysis } from "../api/swapApi";

const SwapChart = () => {
    const [chartData, setChartData] = useState({ data: [], layout: {} });

    const handleFetchData = async () => {
        console.log("🔄 Fetching trade analysis data...");

        try {
            const data = await fetchTradeAnalysis();

            if (!data || data.length === 0) {
                console.error("⚠️ No trade analysis data available.");
                setChartData({ data: [], layout: {} });
                return;
            }

            console.log("📊 Trade Analysis Data:", data);

            //nGroup data by exchange (Uniswap V2, Binance, etc.)
            const groupedData = {
                "Uniswap V2": { x: [], y: [], name: "Uniswap V2" },
                "Uniswap V3": { x: [], y: [], name: "Uniswap V3" },
                "Binance": { x: [], y: [], name: "Binance" }
            };

            data.forEach(trade => {
                const { exchange, trade_size, avg_cost } = trade;

                if (groupedData[exchange]) {
                    groupedData[exchange].x.push(parseFloat(trade_size));
                    groupedData[exchange].y.push(parseFloat(avg_cost));
                }
            });

            // Sort data points for each exchange so the line graph doesn't look messy
            Object.values(groupedData).forEach(dataset => {
                const sortedIndices = dataset.x.map((_, i) => i) // Create index array
                    .sort((a, b) => dataset.x[a] - dataset.x[b]); // Sort indices by trade size

                dataset.x = sortedIndices.map(i => dataset.x[i]); // Reorder x values
                dataset.y = sortedIndices.map(i => dataset.y[i]); // Reorder y values
            });


            // Convert grouped data to Plotly format
            const formattedData = [
                groupedData["Uniswap V3"],
                groupedData["Binance"],
                groupedData["Uniswap V2"]

            ].map(dataset => ({
                ...dataset,
                type: "scatter",   // Use 'scatter' for line graph
                mode: "lines+markers", // Connect points with lines, keep markers
                line: { shape: "spline", width: 2 },  // Smooth lines instead of jagged edges
                marker: { size: 6 }
            }));


            setChartData({
                data: formattedData,
                layout: {
                    title: {
                        text: "Trade Size vs. Average Cost (January 2024)",
                        font: { size: 20 }
                    },
                    xaxis: {
                        title: {
                            text: "Trade Size (Amount of USDT Spent)",
                            font: { size: 16 } // Ensure label visibility
                        },
                        tickformat: ".2f",
                        showgrid: true,
                        zeroline: true
                    },
                    yaxis: {
                        title: {
                            text: "Average Cost (USDT per WETH)",
                            font: { size: 16 } // Ensure label visibility
                        },
                        tickformat: ".4f",
                        showgrid: true,
                        zeroline: true
                    },
                    margin: {
                        l: 160,  // Increase left margin for Y-axis label
                        r: 40,
                        t: 50,
                        b: 50
                    }
                }
            });

        } catch (error) {
            console.error("Error fetching trade analysis data:", error);
            setChartData({ data: [], layout: {} });
        }
    };

    // Download Chart as PNG
    const handleDownloadChart = () => {
        const chartElement = document.querySelector(".js-plotly-plot");

        if (chartElement) {
            html2canvas(chartElement).then((canvas) => {
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = "trade-analysis-chart.png";
                link.click();
            }).catch((err) => console.error("❌ Error generating chart image:", err));
        } else {
            console.error("❌ Chart element not found!");
        }
    };


    useEffect(() => {
        handleFetchData();
    }, []);

    return (
        <div>
            <h2>Trade Size vs. Average Cost</h2>
            <h5>Data from January 2024</h5>

            <button onClick={handleFetchData} className="btn btn-primary mt-2">
                Fetch Data
            </button>

            {/* Display Chart */}
            {chartData.data.length > 0 ? (
                <Plot data={chartData.data} layout={chartData.layout} />
            ) : (
                <p>No data available.</p>
            )}

            <Button variant="success" onClick={handleDownloadChart} className="mt-3">
                Download Chart as PNG
            </Button>

        </div>
    );
};

export default SwapChart;
