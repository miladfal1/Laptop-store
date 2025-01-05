const cron = require("node-cron");
const BlockedIP = require("../models/blockIP.model");
const logger = require("../config/winston.config"); 

cron.schedule("10 * * * *", async () => {
  try {
    const result = await BlockedIP.deleteMany({ expiresAt: { $lt: new Date() } });
    logger.info(`Cron Job: Removed expired blocked IPs`, {
      deletedCount: result.deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Cron Job Error: Failed to remove expired blocked IPs", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }
});
