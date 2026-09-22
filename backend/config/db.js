const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/moventra";
    
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.log("[MongoDB] Tip: Ensure local MongoDB service is running (mongod) or set MONGODB_URI in .env to a MongoDB Atlas cluster.");
  }
};

module.exports = connectDB;

