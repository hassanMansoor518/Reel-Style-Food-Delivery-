const express = require("express");
const router = express.Router();
const { userMiddleware } = require("../middleware/auth.middleware");
const { savePayment } = require("../controller/payment.controller");
const { getOrderStatus , getUserOrders, getOrderDetails} = require("../controller/order.controller");

// Save payment & create order
router.post("/save-payment", userMiddleware, savePayment);

// Get order status
router.get("/status/:orderId", userMiddleware, getOrderStatus);
router.get("/orders", userMiddleware, getUserOrders);
router.get("/details/:orderId", userMiddleware, getOrderDetails);

module.exports = router;




//    /api/payment/save-payment