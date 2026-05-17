const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("Database connected");
    } catch (error) {
        console.log("DB connection failed", error);
        throw error;
    }
}

module.exports = connectDB;