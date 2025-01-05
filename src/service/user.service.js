const user = require("../models/user.model");
const bc = require("bcrypt");
const logger = require("../config/winston.config");

class UserService {
  async getUserById(id) {
    try {
      const foundUser = await user.findById(id);
      if (!foundUser) {
        logger.warn(`User with ID ${id} not found`);
      }
      return foundUser;
    } catch (error) {
      logger.error(`Error fetching user by ID: ${id}`, { message: error.message, stack: error.stack });
      throw error;
    }
  }

  async getUser(username) {
    try {
      const foundUser = await user.findOne({ username });
      logger.info(`User found by username: ${username}`, { user: foundUser });
      return foundUser;
    } catch (error) {
      logger.error(`Error fetching user by username: ${username}`, {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async signUp(username, password) {
    const existingUser = await this.getUser(username);
    if (existingUser) {
      logger.warn(`User already exists with username: ${username}`);
      throw new Error("User already exists.");
    }

    try {
      const hashedPassword = await bc.hash(password, 10);
      logger.info(`Password hashed for username: ${username}`);

      const newUser = new user({ username, password: hashedPassword });
      const savedUser = await newUser.save();

      logger.info(`New user created: ${username}`, { user: savedUser });
      return savedUser;
    } catch (error) {
      logger.error(`Error during sign up for username: ${username}`, {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async signIn(username, password) {
    try {
      const existingUser = await this.getUser(username);
      if (!existingUser) {
        logger.warn(`No user found for username: ${username}`);
        throw new Error("کاربری با این نام کاربری وجود ندارد.");
      }

      const isMatch = await bc.compare(password, existingUser.password);
      if (!isMatch) {
        logger.warn(`Incorrect password attempt for username: ${username}`);
        throw new Error("رمز عبور اشتباه است.");
      }

      logger.info(`User signed in successfully: ${username}`);
      return existingUser;
    } catch (error) {
      logger.error(`Error during sign-in for username: ${username}`, {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async checkPass(username, password) {
    try {
      const user = await this.getUser(username);
      if (!user) {
        logger.warn(`No user found for username: ${username}`);
        throw new Error("کاربری با این نام کاربری یافت نشد.");
      }

      const verifyPassword = await bc.compare(password, user.password);
      logger.info(`Password verification for username: ${username}`, {
        isVerified: verifyPassword,
      });
      return verifyPassword;
    } catch (error) {
      logger.error(`Error during password check for username: ${username}`, {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = new UserService();
