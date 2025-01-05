const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const logger = require("../src/config/winston.config");

const BACKUP_DIR = path.join(__dirname, "../backups");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

  const command = `"C:/Program Files/MongoDB/Tools/<version>/bin/mongodump" --db=security --out=${backupPath}`;
;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error("Database Backup Error:", {
        message: error.message,
        stack: error.stack,
      });
      return;
    }
    if (stderr) {
      logger.warn("Database Backup Warning:", {
        message: stderr,
      });
    }
    logger.info("Database Backup Completed Successfully", {
      path: backupPath,
      output: stdout,
    });
  });
};

module.exports = backupDatabase;
