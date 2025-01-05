const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const userService = require("../service/user.service");
const jwtConfig = require("../config/jwt.config");
const Category = require("../models/category.model");

const checkUser = async (req, res, next) => {
  if (res.locals.user) return next();

  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, jwtConfig.jwtSecret);
      const user = await userService.getUserById(decoded.id);

      if (user) {
        res.locals.user = user;
        req.user = user;
      } else {
        res.locals.user = null;
      }
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

const verifyUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Authentication required. Token is missing." });
  }
  try {
    const decoded = jwt.verify(token, jwtConfig.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.user);
    console.log(user);
    console.log("this is user role : ", user.role);

    if (!user) {
      return res.status(404).redirect("/");
    }
    if (user.role !== "admin") {
      return res.status(403).redirect("/");
    }
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const loadCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.locals.categories = categories; // اضافه کردن داده‌ها به res.locals
    next();
  } catch (error) {
    console.error(error);
    next(error); // ادامه با خطا
  }
};

module.exports = { loadCategories, checkUser, isAdmin, verifyUser };
