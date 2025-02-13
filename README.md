# Uniswap Swap Analysis

## Overview
This project collects and analyzes swap data from **UniSwap V2, UniSwap V3**, and **Binance mid-prices** to compare trading costs. It saves all swaps for the **WETH/USDT** market within **January 2024** into a database and visualizes trade size vs. average cost per exchange.

## Features
- **Data Collection**: Fetches swap data from **Dune API** for UniSwap V2 & V3.
- **Database Storage**: Saves fetched swaps into a **PostgreSQL** database.
- **Price Comparison**: Matches swap prices with Binance mid-prices.
- **Visualization**: Generates a **line graph** of trade size vs. average cost per exchange.
- **Image Generation**: Creates a PNG file of the graph for submission.

## Installation & Setup

### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** & **npm** (for backend and frontend)
- **PostgreSQL** (for database storage)
- **DBeaver** (optional, for database visualization)

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/ddurmala/uniswap-swap-analysis.git
cd uniswap-swap-analysis
```

### 3️⃣ Setup the Backend
#### Install dependencies:
```sh
cd server
npm install
```
#### Configure Environment Variables:
Create a `.env` file in the `server` directory:
```sh
DUNE_API_KEY=your_dune_api_key
PG_URI=your_postgres_connection_string
PORT=3001
```

#### Start the Backend:
```sh
npm start
```

### 4️⃣ Setup the Frontend
#### Install dependencies:
```sh
cd client
npm install
```
#### Start the Frontend:
```sh
npm start
```
Then open **http://localhost:3000** in your browser.

## How It Works
### **Step 1: Fetching Swap Data (Backend)**
📌 Implemented in [`fetchData.js`](server/fetchData.js)
- Calls **Dune API** to fetch **WETH/USDT** swaps for January 2024.
- Saves swaps into the **PostgreSQL** database.
- Stores **exchange, amount_in, amount_out, token_in, token_out, timestamp**.
- **Files**: `fetchData.js`, `saveData.js`

### **Step 2: Storing Data in PostgreSQL**
📌 Implemented in [`saveData.js`](server/saveData.js)
- Inserts swaps into the **`swaps`** table.
- Validates and formats timestamps.
- **Tables**: `swaps`, `price_analysis`
- **Files**: `saveData.js`, `db.js`

### **Step 3: Fetching Binance Prices & Analysis**
📌 Implemented in [`server.js`](server/server.js)
- Queries database for **Binance mid-prices**.
- Compares with **Uniswap trade prices**.
- Stores **price differences**.
- **Files**: `server.js`, `db.js`

### **Step 4: Visualizing Data (Frontend)**
📌 Implemented in [`SwapChart.js`](client/src/components/SwapChart.js)
- Fetches trade analysis data from the backend (`/trade-analysis`).
- Plots **Trade Size (x-axis) vs. Average Cost (y-axis)**.
- Generates a **line graph** with one line per exchange.
- Saves the chart as a PNG file.
- **Libraries Used**: `react-plotly.js`, `html2canvas`

### **Step 5: Generating and Saving the Graph**
📌 Implemented in [`SwapChart.js`](client/src/components/SwapChart.js)
- Uses **Plotly.js** to create a **line chart**.
- **Ensures x-axis is sorted** for proper visualization.
- Allows downloading the chart as a PNG.

## API Endpoints
| Method | Endpoint            | Description                    |
|--------|--------------------|--------------------------------|
| `GET`  | `/fetch-all`       | Fetches & stores all swaps    |
| `GET`  | `/swap-prices`     | Retrieves trade analysis data |
| `GET`  | `/trade-analysis`  | Fetches and compares prices   |

## How to Run the Full Project
```sh
# Start PostgreSQL database
pg_ctl -D /usr/local/var/postgres start  # Mac/Linux
# or
net start postgresql  # Windows

# Start backend
cd server
npm start

# Start frontend
cd client
npm start
```

## Example Output
Once everything is running, you will see a **line chart** comparing **Uniswap V2, Uniswap V3, and Binance prices** for **WETH/USDT** trades in January 2024.

## Notes & Future Work
- **Currently only supports WETH/USDT** (can be expanded to other pairs).
- **Cowswap data is not implemented yet** (left out for scope reasons).
- **Potential improvements**: UI enhancements, API error handling.
- A repository branch was created to make data input **more dynamic**, including a UI form that allows users to select token pairs and time frames dynamically.

![Screenshot of app](./data/Screenshot%201.png)
