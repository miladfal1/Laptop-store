const jwt = require("jsonwebtoken");
const bc = require("bcrypt");
const userService = require("../service/user.service");
const validationService = require("../service/validation.service");
const tokenService = require("../service/token.service");
const Order = require("../models/order.model");
const { isIpBlocked, handleFailedAttempt, resetLimit } = require("../service/rateLimiter.service");
const logger = require("../config/winston.config");

const maxAge = 3 * 24 * 60 * 60 * 60 * 60;

const getSignUp = (req, res) => {
  const error = req.flash("message");
  logger.info("Rendering signup page");
  res.render("signup", { error });
};

const getLogin = (req, res) => {
  const error = req.flash("message");
  logger.info("Rendering login page");
  res.render("login", { error });
};

const getLogOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, httpOnly: true });
    res.cookie("refresh", "", { maxAge: 1, httpOnly: true });

    const refreshToken = req.cookies.refresh;
    if (refreshToken) {
      await tokenService.deleteRefreshToken(refreshToken);
      logger.info("Refresh token deleted successfully");
    }

    res.redirect("/");
  } catch (err) {
    logger.error(`[Error] Failed to log out: ${err.message}`);
    res.status(500).json({ message: "Failed to log out." });
  }
};

const postSignUp = async (req, res) => {
  const { username, password } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  console.log(clientIp);

  try {
    const isBlocked = await isIpBlocked(clientIp);
    if (isBlocked) {
      logger.warn(`IP ${clientIp} is blocked. Sending 503 response.`);
      return res.status(503).send("Service Unavailable");
    }

    validationService.validateInput(username, password);
    const user = await userService.signUp(username, password);

    const accessToken = tokenService.generateAccessToken({ id: user._id });
    const refreshToken = await tokenService.generateRefreshToken({ id: user._id });

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    logger.info(`User ${username} successfully signed up`);
    res.status(201).redirect("/");
    return;
  } catch (err) {
    await handleFailedAttempt(clientIp);
    logger.error(`Error during signup attempt by IP ${clientIp}: ${err.message}`);
    req.flash("message", err.message);
    res.redirect("/login");
    return;
  }
};

const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    const isBlocked = await isIpBlocked(clientIp);
    if (isBlocked) {
      logger.warn(`IP ${clientIp} is blocked. Sending 503 response.`);
      return res.status(503).send("Service Unavailable");
    }

    validationService.validateInput(username, password);

    const user = await userService.signIn(username, password);

    const accessToken = tokenService.generateAccessToken({ id: user._id });
    const refreshToken = await tokenService.generateRefreshToken({ id: user._id });

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    logger.info(`User ${username} successfully logged in`); // لاگ موفقیت‌آمیز
    res.status(201).redirect("/");
    return;
  } catch (err) {
    await handleFailedAttempt(clientIp);
    logger.error(`Error during login attempt by IP ${clientIp}: ${err.message}`); // لاگ خطا
    req.flash("message", err.message);
    res.redirect("/login");
    return;
  }
};

const profile = async (req, res) => {
  try {
    const userId = res.locals.user._id;

    const user = await userService.getUserById(userId);
    if (!user) {
      logger.warn(`User ID ${userId} not found. Redirecting to homepage.`); // لاگ هشدار
      throw new Error("لطفا وارد حساب خود شوید یا ثبت نام کنید");
    }

    const orders = await Order.find({ user: userId }).populate("order");

    logger.info(`Rendering profile page for user ${userId}`); // لاگ موفقیت‌آمیز
    res.render("profile", {
      user,
      orders,
    });
  } catch (err) {
    logger.error(`Error fetching profile for user ${res.locals.user._id}: ${err.message}`); // لاگ خطا
    req.flash("message", err.message);
    res.redirect("/");
  }
};

module.exports = {
  getLogin,
  postLogin,
  getSignUp,
  postSignUp,
  getLogOut,
  profile,
};
