const BlockedIP = require("../models/blockIP.model");
const logger = require("../config/winston.config");

const rateLimiter = {};

const isIpBlocked = async (ip) => {
  const blockedIp = await BlockedIP.findOne({ ip });
  if (blockedIp) {
    logger.warn(`Blocked IP detected: ${ip}`);
  }
  return !!blockedIp;
};

const handleFailedAttempt = async (ip) => {
  const now = Date.now();

  if (!rateLimiter[ip]) {
    rateLimiter[ip] = { count: 1, firstAttempt: now };
    logger.info(`First failed attempt for IP: ${ip}`);
    return;
  }

  rateLimiter[ip].count++;

  const timeSinceFirstAttempt = now - rateLimiter[ip].firstAttempt;
  logger.info(
    `IP: ${ip} - Attempt count: ${rateLimiter[ip].count}, Time since first attempt: ${
      timeSinceFirstAttempt / 1000
    } seconds`
  );

  if (rateLimiter[ip].count > 3 && timeSinceFirstAttempt < 15 * 60 * 1000) {
    const blockedIp = await BlockedIP.findOneAndUpdate(
      { ip },
      {
        ip,
        reason: "too many attempts",
        blockedAt: now,
        expiresAt: now + 1 * 60 * 1000,
      },
      { upsert: true, new: true }
    );

    logger.warn(
      `IP blocked: ${ip} - Reason: ${blockedIp.reason}, Blocked at: ${new Date(blockedIp.blockedAt).toISOString()}`
    );
  }

  if (timeSinceFirstAttempt > 2 * 60 * 1000) {
    logger.info(`Rate limit reset for IP: ${ip}`);
    rateLimiter[ip] = { count: 1, firstAttempt: now };
  }
};

module.exports = {
  isIpBlocked,
  handleFailedAttempt,
};
