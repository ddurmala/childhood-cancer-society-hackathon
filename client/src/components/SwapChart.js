import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Form, Button } from "react-bootstrap"; // ✅ Using Bootstrap for styling

const SwapChart = () => {
    const [chartData, setChartData] = useState({ data: [], layout: {} });
    const [month, setMonth] = useState("1");
    const [year, setYear] = useState("2024");

    const handleFetchData = () => {
        if (!month || !year) {
            console.error("Month or year is not selected properly.");
            return;
        }

        console.log(`🔍 Fetching data for ${month}/${year}`);

        fetch(`http://localhost:3001/swap-prices?month=${month}&year=${year}`)
            .then(response => response.json())
            .then(data => {
                console.log("📊 Fetched Data:", data);
                if (!data || data.error || data.length === 0) {
                    console.error("⚠️ No data available.");
                    return;

                }
                setChartData(data);
            })
            .catch(error => console.error("Error fetching swap data:", error));
    };

    useEffect(() => {
        if (month && year) {
            handleFetchData();
        }
    }, [month, year]); // Only fetch when month & year are set

    return (
        <div>
            <h2>Uniswap Swap Data</h2>
            <h5>{month && year ? `Data from ${month}/${year}` : "Select a month and year"}</h5>

            {/* Month & Year Selection */}
            <Form>
                <Form.Group controlId="monthSelect">
                    <Form.Label>Select Month:</Form.Label>
                    <Form.Select value={month} onChange={e => setMonth(e.target.value)}>
                        <option value="">-- Select Month --</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="yearSelect">
                    <Form.Label>Select Year:</Form.Label>
                    <Form.Select value={year} onChange={e => setYear(e.target.value)}>
                        <option value="">-- Select Year --</option>
                        {["2023", "2024"].map(y => <option key={y} value={y}>{y}</option>)}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" onClick={handleFetchData} className="mt-2">Fetch Data</Button>
            </Form>

            {/* Display Chart */}
            {chartData.data.length > 0 ? (
                <Plot data={chartData.data} layout={chartData.layout} />
            ) : (
                <p>No data available. Please select a valid month and year.</p>
            )}
        </div>
    );
};

export default SwapChart;
