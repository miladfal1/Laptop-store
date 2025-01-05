const Item = require("../models/item.model");
const Category = require("../models/category.model");
const path = require("path");

const getCategoryItems = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const cat = await Category.findOne({ name: categoryName });

    const sort = req.query.sort || "asc";
    const sortOrder = sort === "asc" ? 1 : -1;
    const items = await Item.find({ category: categoryName }).sort({ price: sortOrder });
    res.render("items", { items: items, category: categoryName, cat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findOne({ _id: id });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  try {
    const imagePath = req.file ? path.join("/", req.file.path).replace(/\\/g, "/") : null;

    const item = new Item({
      ...req.body,
      img: imagePath,
    });

    const savedItem = await item.save();

    res.redirect("/admin");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItem = await Item.findOneAndDelete({ _id: id });
    if (!deleteItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.redirect("/admin");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    // بررسی وجود فایل تصویر
    const imagePath = req.file ? path.join("/", req.file.path).replace(/\\/g, "/") : null;

    // یافتن آیتم فعلی
    const currentItem = await Item.findById(id);
    if (!currentItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ایجاد آبجکت برای داده‌های به‌روزرسانی
    const updatedData = {
      name: req.body.name || currentItem.name,
      price: req.body.price || currentItem.price,
      category: req.body.category || currentItem.category,
      img: imagePath || currentItem.img, // استفاده از تصویر قبلی در صورت عدم آپلود تصویر جدید
    };

    // به‌روزرسانی آیتم
    const updatedItem = await Item.findOneAndUpdate({ _id: id }, updatedData, { new: true });

    res.redirect("/admin");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllItems = async (req, res) => {
  try {
    const result = await Item.deleteMany({});

    res.json({
      message: `${result.deletedCount} categories were deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategoryItems, addItem, getItem, deleteItem, updateItem, deleteAllItems };
