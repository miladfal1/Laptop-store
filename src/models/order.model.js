const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  qty: { type: Number },
  img: { type: String },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resnumber: { type: String, required: true },
  order: [orderItemSchema],
  amount: { type: Number, required: true },
  orderNumber: { type: String, unique: true },
  status: { type: Boolean, default: false },
});

orderSchema.pre("save", async function (next) {
  const order = this;

  if (!order.orderNumber) {
    const lastOrder = await mongoose.model("Order").findOne().sort({ _id: -1 });

    let nextOrderNumber = 1;

    if (lastOrder) {
      const lastOrderNumber = parseInt(lastOrder.orderNumber.replace("ord", ""));
      nextOrderNumber = lastOrderNumber + 1;
    }

    order.orderNumber = `ord${nextOrderNumber}`;
  }

  next();
});

module.exports = mongoose.model("Order", orderSchema);
