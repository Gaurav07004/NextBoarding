const mongoose = require('mongoose');
const URL = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;