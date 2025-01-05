const winston = require("winston");
const { format } = require("winston");
require("winston-daily-rotate-file");
const { ElasticsearchTransport } = require("winston-elasticsearch");

const logFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

const transportConsole = new winston.transports.Console({
  level: "info",
  format: logFormat,
});

const transportFile = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-application.log",
  datePattern: "YYYY-MM-DD",
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
});

const esTransport = new ElasticsearchTransport({
  level: "info",
  clientOpts: {
    node: "http://localhost:9200", 
    auth: {
      username: "elastic", 
      password: "your_password", 
    },
  },
  indexPrefix: "application-logs",
});

const logger = winston.createLogger({
  level: "info",
  transports: [transportConsole, transportFile, esTransport],
});

module.exports = logger;
