const cron = require("node-cron");
const { exec } = require("child_process");
const logger = require("../config/winston.config");

cron.schedule("0 2 * * *", () => {
  try {
    exec(
      "npm install && npm update",
      { cwd: "C:/Users/milad/Desktop/git-repositories/ecommerce" },
      (error, stdout, stderr) => {
        if (error) {
          logger.error("Cron Job Error: Failed to update packages", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
          });
          return;
        }
        if (stderr) {
          logger.error("Cron Job Warning: stderr", {
            message: stderr,
            timestamp: new Date().toISOString(),
          });
        }
        logger.info("Cron Job: Packages updated successfully", {
          output: stdout,
          timestamp: new Date().toISOString(),
        });
      }
    );
  } catch (error) {
    logger.error("Cron Job Error: Failed to run update script", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }
});
