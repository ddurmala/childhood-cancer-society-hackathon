require("dotenv").config();
const { Sequelize } = require("sequelize");

//environment variables
const DB_NAME = process.env.DB_NAME || "swap_data";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "pass";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 5432;

//Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: false, // Disable SQL query logging (optional)
});

//Test database connection
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to PostgreSQL database successfully.");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit process if connection fails
    }
}

//Swaps Table Model
const Swap = sequelize.define("Swap", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    exchange: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amountUSD: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    realized_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}, {
    tableName: "uniswap_swaps",
    timestamps: false,
});

//Sync Database & Create Table if Not Exists
async function initDB() {
    await sequelize.sync();
    console.log("✅ Swaps table is ready.");
}

//Run connection functions
connectDB();
initDB();

// export Sequelize instance & Swap model
module.exports = { sequelize, Swap };
