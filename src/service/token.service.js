const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");
const RefreshTokenModel = require("../models/token.model");
const logger = require("../config/winston.config"); 

class TokenService {
  generateAccessToken(userID) {
    try {
      const token = jwt.sign(userID, jwtConfig.jwtSecret, { expiresIn: 60 * 60 * 1000 });
      logger.info("New access token generated: ", token); 
      return token;
    } catch (error) {
      logger.error("Error generating access token:", error.message); 
      throw error;
    }
  }

  async generateRefreshToken(userID) {
    try {
      const token = jwt.sign(userID, jwtConfig.refreshSecret, { expiresIn: 24 * 60 * 60 * 1000 });
      logger.info("New refresh token generated: ", token); 

      await RefreshTokenModel.create({
        token,
        userId: userID.id,
      });

      return token;
    } catch (error) {
      logger.error("Error generating refresh token:", error.message);
      throw error;
    }
  }

  verifyToken(token, secret) {
    try {
      logger.info("Verifying token:", token); 
      return jwt.verify(token, secret);
    } catch (error) {
      logger.error("Token verification failed:", error.message);
      throw new Error("Token is not valid or has expired.");
    }
  }

  async isRefreshTokenValid(token) {
    try {
      const tokenRecord = await RefreshTokenModel.findOne({ token });
      logger.info("Checked refresh token validity:", token); 
      return !!tokenRecord;
    } catch (error) {
      logger.error("Error checking refresh token:", error.message);
      throw error;
    }
  }

  async deleteRefreshToken(token) {
    try {
      await RefreshTokenModel.deleteOne({ token });
      logger.info("Refresh token deleted successfully:", token); 
    } catch (error) {
      logger.error("Error deleting refresh token:", error.message); 
      throw error;
    }
  }

  getUserFromToken(token) {
    try {
      const decoded = jwt.decode(token);
      logger.info("Decoded token userID:", decoded); 
      return decoded;
    } catch (error) {
      logger.error("Error decoding token:", error.message);
      throw new Error("Failed to decode token.");
    }
  }
}

module.exports = new TokenService();
