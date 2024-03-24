const mongoose = require('mongoose');
const URL = process.env.MONGODB_URI;


const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Connect successfully")
    } catch (error) {
        console.error("database connection failed",error.message);
        process.exit(0);
    }
};

module.exports = connectDB;

