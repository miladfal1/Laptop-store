const Category = require("../models/category.model");
const path = require("path");
const logger = require("../config/winston.config");  

const getAllCategories = async (req, res) => {
  try {
    logger.info("Fetching all categories");  

    const categories = await Category.find({});
    
    logger.info(`Successfully fetched ${categories.length} categories`);  

    res.json(categories);
  } catch (error) {
    logger.error(`Error fetching categories: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching category with ID: ${id}`);  

    const findCategory = await Category.findOne({ _id: id });

    if (!findCategory) {
      logger.warn(`Category with ID ${id} not found`);  
      return res.status(404).json({ message: "Category not found" });
    }

    logger.info(`Category with ID ${id} fetched successfully`);  
    res.json(findCategory);
  } catch (error) {
    logger.error(`Error fetching category with ID ${req.params.id}: ${error.message}`);  
    res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    logger.info("Adding a new category");  

    const imagePath = req.file ? path.join("/", req.file.path).replace(/\\/g, "/") : null;
    const item = new Category({ ...req.body, img: imagePath });
    
    const savedItem = await item.save();

    logger.info(`Category with ID ${savedItem._id} added successfully`);  

    res.redirect("/admin");
  } catch (error) {
    logger.error(`Error adding category: ${error.message}`);  
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting category with ID: ${id}`);  

    const deleteCategory = await Category.findOneAndDelete({ _id: id });

    if (!deleteCategory) {
      logger.warn(`Category with ID ${id} not found for deletion`);  
      return res.status(404).json({ message: "Item not found" });
    }

    logger.info(`Category with ID ${id} deleted successfully`);  
    res.redirect("/admin");
  } catch (error) {
    logger.error(`Error deleting category with ID ${req.params.id}: ${error.message}`);  
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Updating category with ID: ${id}`); 

    const imagePath = req.file ? path.join("/", req.file.path).replace(/\\/g, "/") : null;
    const updateCategory = await Category.findOneAndUpdate(
      { _id: id },
      { ...req.body, img: imagePath },
      { new: true }
    );

    if (!updateCategory) {
      logger.warn(`Category with ID ${id} not found for update`);  
      return res.status(404).json({ message: "Item not found" });
    }

    logger.info(`Category with ID ${id} updated successfully`);  
    res.redirect("/admin");
  } catch (error) {
    logger.error(`Error updating category with ID ${req.params.id}: ${error.message}`); 
    res.status(500).json({ message: error.message });
  }
};

const deleteAllCategories = async (req, res) => {
  try {
    logger.info("Deleting all categories"); 

    const result = await Category.deleteMany({});

    logger.info(`Successfully deleted all categories`);
    res.redirect("/admin");
  } catch (error) {
    logger.error(`Error deleting all categories: ${error.message}`);  
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCategories, addCategory, getCategory, deleteCategory, updateCategory, deleteAllCategories };
