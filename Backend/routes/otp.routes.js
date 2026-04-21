const express = require("express");
const router = express.Router();
const { userMiddleware } = require("../middleware/auth.middleware");
const { sendOrderOtp, verifyOrderOtp } = require("../controller/order.controller");

// Generate OTP after order/payment
// Send OTP

//  /api/order

router.post("/send-otp", userMiddleware, sendOrderOtp);

// Verify OTP
router.post("/verify-otp", userMiddleware, verifyOrderOtp);



module.exports = router;
