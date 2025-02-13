import React, { useState } from "react";
import SwapChart from "./components/SwapChart";

function App() {
  const [activeTab, setActiveTab] = useState("swaps");

  return (
    <div className="container mt-5">
      <h1 className="text-center">Uniswap Swap Data</h1>

      <div className="d-flex justify-content-center mt-3">
        <button className={`btn ${activeTab === "swaps" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("swaps")}>
          Swap Prices
        </button>
        <button className={`btn mx-2 ${activeTab === "analysis" ? "btn-success" : "btn-outline-success"}`} onClick={() => setActiveTab("analysis")}>
          Trade Analysis
        </button>
      </div>

      {activeTab === "swaps" ? <SwapChart /> : <p className="text-center">Trade analysis coming soon...</p>}
    </div>
  );
}

export default App;
