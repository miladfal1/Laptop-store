const express = require("express");
const router = express.Router();
const { userController, mainController } = require("../controller");
const { checkUser, isAdmin, verifyUser } = require("../middleware/auth.middleware");

router.get("/signup", userController.getSignUp);
router.get("/login", userController.getLogin);
router.use(checkUser);

router.route("/").get(mainController.getMain);
router.post("/signup", userController.postSignUp);
router.post("/login", userController.postLogin);
router.get("/logout", userController.getLogOut);
router.get("/profile", verifyUser, userController.profile);

module.exports = router;
