const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_customer_service');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message} (Running in Mock Mode)`);
        // process.exit(1); // Don't crash, allow fallback
    }
};

module.exports = connectDB;
