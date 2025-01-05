const Order = require("../models/order.model");
const axios = require("axios");
const logger = require("../config/winston.config");  

const getAllOrders = async (req, res) => {
  try {
    logger.info("Fetching all orders"); // لاگ شروع عملیات

    const orders = await Order.find({});

    logger.info(`Successfully fetched ${orders.length} orders`); // لاگ موفقیت‌آمیز

    res.json(orders);
  } catch (error) {
    logger.error(`Error fetching orders: ${error.message}`); // لاگ خطا
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    logger.info(`Fetching order with ID: ${id}`); // لاگ شروع عملیات

    const order = await Order.findOne({ _id: id });

    if (!order) {
      logger.warn(`Order with ID ${id} not found`); // لاگ هشدار
      return res.status(404).json({ message: "Order not found" });
    }

    logger.info(`Successfully fetched order with ID: ${id}`); // لاگ موفقیت‌آمیز
    res.json(order);
  } catch (error) {
    logger.error(`Error fetching order with ID ${req.params.id}: ${error.message}`); // لاگ خطا
    res.status(500).json({ message: error.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const { order, amount } = req.body;

    if (!amount || !order) {
      logger.warn("Invalid request: Missing order or amount"); // لاگ هشدار
      return res.status(400).send("Invalid request: Missing order or amount");
    }

    logger.info(`Initiating payment request for order with amount: ${amount}`); // لاگ شروع عملیات

    let response;
    try {
      const params = {
        merchant_id: "23456789-4567-1234-2345-234512346789", // مقدار تستی
        amount: amount,
        callback_url: "http://localhost:3000/callback",
        description: "test add payment",
      };

      response = await axios.post("https://api.zarinpal.com/pg/v4/payment/request.json", params);
    } catch (err) {
      logger.error(`Error in payment request: ${err.message}`); // لاگ خطا
      response = null; // در صورت خطا، پاسخ را null قرار دهید
    }

    // ساخت سفارش جدید
    const newOrder = new Order({
      user: req.user?._id || "test_user",
      order: order,
      amount: amount,
      resnumber: response?.data?.Authority || "test_authority",
      status: true,
    });

    await newOrder.save();

    if (response && response.data?.status === 100) {
      logger.info(`Payment request successful, redirecting to payment gateway for order ${newOrder._id}`); // لاگ موفقیت‌آمیز
      res.redirect(`https://sandbox.zarinpal.com/pg/StartPay/${response.data.Authority}`);
    } else {
      logger.warn("Payment initiation failed, redirecting to profile page"); // لاگ هشدار
      res.status(200).redirect("/profile");
    }
  } catch (error) {
    logger.error(`Error saving order: ${error.message}`); // لاگ خطا
    res.status(500).send("Error saving order");
  }
};

const payCallBack = async (req, res) => {
  logger.info("Received payment callback"); // لاگ دریافت کال‌بک

  try {
    // منطق callback
  } catch (err) {
    logger.error(`Error in payment callback: ${err.message}`); // لاگ خطا
  }
};

const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    logger.info(`Updating order with ID: ${id}`); // لاگ شروع عملیات

    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrder) {
      logger.warn(`Order with ID ${id} not found for update`); // لاگ هشدار
      return res.status(404).json({ message: "Order not found" });
    }

    logger.info(`Order with ID ${id} updated successfully`); // لاگ موفقیت‌آمیز
    res.json(updatedOrder);
  } catch (error) {
    logger.error(`Error updating order with ID ${req.params.id}: ${error.message}`); // لاگ خطا
    res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    logger.info(`Deleting order with ID: ${id}`); // لاگ شروع عملیات

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      logger.warn(`Order with ID ${id} not found for deletion`); // لاگ هشدار
      return res.status(404).json({ message: "Order not found" });
    }

    logger.info(`Order with ID ${id} deleted successfully`); // لاگ موفقیت‌آمیز
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting order with ID ${req.params.id}: ${error.message}`); // لاگ خطا
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllOrders, getOrderById, addOrder, payCallBack, updateOrder, deleteOrder };
