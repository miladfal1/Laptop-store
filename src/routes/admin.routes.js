const express = require("express");
const router = express.Router();
const { adminController } = require("../controller");
const { checkUser, isAdmin } = require("../middleware/auth.middleware");

router.get("*", checkUser);

router.route("/admin").get(isAdmin, adminController.getAdmin);
router.route("/adminlogin").get(adminController.getAdminLogin).post(adminController.postAdminLogin);

module.exports = router;
