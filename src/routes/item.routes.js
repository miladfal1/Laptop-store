const express = require("express");
const {
  getCategoryItems,
  addItem,
  getItem,
  deleteItem,
  updateItem,
  deleteAllItems,
} = require("../controller/item.controller");
const router = express.Router();
const upload = require("../config/multer.config");

router.get("/item/:category", getCategoryItems);
router.post("/item/", upload.single("img"), addItem);
router.get("/item/:id", getItem);
router.post("/item/delete/:id", deleteItem);
router.post("/item/:id", upload.single("img"), updateItem);

module.exports = router;
