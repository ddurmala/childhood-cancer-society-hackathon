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
            const groupedData = {};
            data.forEach(trade => {
                const { exchange, trade_size, avg_cost } = trade;

                if (!groupedData[exchange]) {
                    groupedData[exchange] = { x: [], y: [], name: exchange };
                }

                groupedData[exchange].x.push(parseFloat(trade_size));
                groupedData[exchange].y.push(parseFloat(avg_cost));
            });

            Object.keys(groupedData).forEach(exchange => {
                const combined = groupedData[exchange].x.map((size, i) => ({
                    size,
                    cost: groupedData[exchange].y[i],
                }));

                combined.sort((a, b) => a.size - b.size);

                groupedData[exchange].x = combined.map(d => d.size);
                groupedData[exchange].y = combined.map(d => d.cost);
            });

            // Convert grouped data to Plotly format
            const formattedData = Object.values(groupedData).map(dataset => ({
                ...dataset,
                type: "scatter",
                mode: "lines+markers"
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
