const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");
const TokenService = require("../service/token.service");
const logger = require("../config/winston.config");  

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refresh;

  if (!refreshToken) {
    logger.warn("Refresh token is missing in the request"); 
    return res.status(401).json({ message: "Refresh token is missing." });
  }

  const tokenExists = await TokenService.isRefreshTokenValid(refreshToken);
  if (!tokenExists) {
    logger.warn("Invalid or expired refresh token received"); 
    return res.status(403).json({ message: "Invalid or expired refresh token." });
  }

  try {
    const userData = TokenService.verifyToken(refreshToken, jwtConfig.refreshSecret);
    const newAccessToken = TokenService.generateAccessToken({ id: userData.id });

    logger.info("Successfully generated new access token");
    logger.debug(`Generated token for user ID: ${userData.id}`);

    res.cookie("jwt", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Access token refreshed successfully." });
  } catch (err) {
    logger.error(`Error refreshing access token: ${err.message}`);
    return res.status(403).json({ message: "Invalid or expired refresh token." });
  }
};

module.exports = {
  refreshAccessToken,
};
