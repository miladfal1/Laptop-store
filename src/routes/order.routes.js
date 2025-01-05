const express = require("express");
const router = express.Router();
const { orderController } = require("../controller/index");
const Item = require("../models/item.model");

router.get("/order", async (req, res) => {
  const items = await Item.find();
  res.render("order", { items });
});

router.post("/order", orderController.addOrder);
router.route("/callback").get(orderController.payCallBack);
router.get("/order/:phone", orderController.getOrderById);
router.put("/order/:phone", orderController.updateOrder);
router.delete("/order/:phone", orderController.deleteOrder);

module.exports = router;
