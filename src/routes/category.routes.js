const express = require("express");
const router = express.Router();
const { categoryController } = require("../controller/index");
const upload = require("../config/multer.config");

router
  .route("/category")
  .get(categoryController.getAllCategories)
  .post(upload.single("img"), categoryController.addCategory);
router.route("/onlyIKnow").delete(categoryController.deleteAllCategories);
router
  .route("/category/:id")
  .get(categoryController.getCategory)
  .post(upload.single("img"), categoryController.updateCategory);

router.route("/category/delete/:id").post(categoryController.deleteCategory);

module.exports = router;
