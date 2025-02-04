import React, { useEffect, useState } from "react";
import { fetchSwaps } from "../api/swapApi";

const SwapTable = () => {
    const [swaps, setSwaps] = useState([]);

    useEffect(() => {
        const getSwaps = async () => {
            const data = await fetchSwaps();
            setSwaps(data);
        };
        getSwaps();
    }, []);

    return (
        <div className="container m-5 p-3">

            <h2 className="text-center mb-4">Uniswap Swap Data</h2>
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Amount In (WETH)</th>
                        <th>Amount Out (USDT)</th>
                        <th>Gas Estimate</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {swaps.length > 0 ? (
                        swaps.map((swap) => (
                            <tr key={swap.id}>
                                <td>{swap.id}</td>
                                <td>{swap.amount_in}</td>
                                <td>{swap.amount_out}</td>
                                <td>{swap.gas_estimate}</td>
                                <td>{new Date(swap.timestamp).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No swap data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

};

export default SwapTable;
