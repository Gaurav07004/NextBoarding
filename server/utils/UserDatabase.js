const mongoose = require('mongoose');
const URL = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        //console.log("Attempting to connect to MongoDB...");
        //console.log("URI:", URL); // Log the URI to verify it's not undefined
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);     
    }
};

module.exports = connectDB;
