const mongoose = require("mongoose");
const logger = require("../config/winston.config");  

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/security"
    );
    logger.info("Connected to DB successfully.");
  } catch (err) {
    logger.error("Error connecting to DB:", {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);  
  }
};

module.exports = connectDB;
