const cron = require("node-cron");
const backupDatabase = require("../backup");
const logger = require("../config/cors.config");

cron.schedule("*/2 * * * *", () => {
  logger.info("Database Backup Cron Job Started...");
  backupDatabase();
});
