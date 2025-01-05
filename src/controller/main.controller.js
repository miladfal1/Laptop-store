const Category = require("../models/category.model");
const Item = require("../models/item.model");
const User = require("../models/user.model");
const logger = require("../config/winston.config");  

const getMain = async (req, res) => {
  try {
    logger.info("Fetching categories, items, and discounted laptops for the main page");

    const categories = await Category.find({});
    const items = await Item.find({}).sort({ _id: -1 }).limit(6);
    const discountedLaptops = await Item.find({ discountPrice: { $exists: true, $ne: null } }).limit(10);

    logger.info("Successfully fetched categories, items, and discounted laptops"); 

    res.render("index", { categories, items, discountedLaptops });
  } catch (err) {
    logger.error(`Error fetching categories or items: ${err.message}`);
    res.status(500).send("Server Error");
  }
};

module.exports = { getMain };
