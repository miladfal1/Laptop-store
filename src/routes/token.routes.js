const express = require("express");
const router = express.Router();
const authController = require("../controller/token.controller");

const rateLimit = require("express-rate-limit");

const refreshTokenLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: "Too many requests. Please try again later.",
});

router.post("/auth/refresh-token", refreshTokenLimiter, authController.refreshAccessToken);

module.exports = router;
