const jwt = require("jsonwebtoken");
const bc = require("bcrypt");
const userService = require("../service/user.service");
const tokenService = require("../service/token.service");
const Item = require("../models/item.model");
const Category = require("../models/category.model");
const logger = require("../config/winston.config");  

const maxAge = 3 * 24 * 60 * 60 * 60 * 60;

const getAdmin = async (req, res) => {
  try {
    logger.info("Fetching items and categories for admin");  // اطلاعات موفق
    const items = await Item.find();
    const categories = await Category.find();
    res.render("admin", { items, categories });
  } catch (error) {
    logger.error(`Error fetching items and categories: ${error.message}`);  // خطا
    res.status(500).json({ message: error.message });
  }
};

const getAdminLogin = (req, res) => {
  const error = req.flash("message");
  logger.info("Rendering admin login page");  // اطلاعات موفق
  res.render("adminLogin", { error });
};

const postAdminLogin = async (req, res) => {
  const { username, password } = req.body;
  logger.debug(`Login attempt for username: ${username}`);  // اطلاعات دیباگ

  try {
    const user = await userService.signIn(username, password);
    logger.info(`User ${username} logged in successfully`);  // اطلاعات موفق
    const token = tokenService.generateToken({ id: user._id });
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/admin");
  } catch (err) {
    logger.error(`Error during login for username ${username}: ${err.message}`);  // خطا
    req.flash("message", err.message);
    res.redirect("/adminlogin");
  }
};

module.exports = { getAdmin, postAdminLogin, getAdminLogin };
