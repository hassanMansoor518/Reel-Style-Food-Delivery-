const Order = require("../model/order.model");
const User = require("../model/user.model");
const { generateOtp, saveOtp, sendOtpEmail, verifyOtp } = require("../service/otp.service");


// -------------------------
// Get Order Status
// -------------------------
exports.getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ status: order.status });
  } catch (err) {
    console.error("ORDER STATUS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------------
// Get User Orders
// -------------------------
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => ({
      id: order._id.toString().slice(-8),
      restaurant: order.restaurant,
      status: order.status,
      eta: order.eta || "15 minutes",
      progress: order.progress || null,
      type: order.type || "ongoing",
      createdAt: order.createdAt,
      items: order.items,
      totalItems: order.items.length,
      totalPrice: order.totalPrice,
      name: order.name,
      paymentMethod: order.paymentMethod,
    }));

    res.status(200).json({ success: true, data: formattedOrders });
  } catch (err) {
    console.error("GET USER ORDERS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// -------------------------
// Send OTP After Order / Payment
// -------------------------
exports.sendOrderOtp = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.body;

    if (!orderId) return res.status(400).json({ success: false, message: "Order ID required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOtp();
    await saveOtp(userId, orderId, otp);

    const emailSent = await sendOtpEmail(user.email, otp);
    if (!emailSent) return res.status(500).json({ success: false, message: "Failed to send OTP" });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify OTP
exports.verifyOrderOtp = async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    const userId = req.user._id;

    if (!orderId || !otp) return res.status(400).json({ success: false, message: "Order ID & OTP required" });

    const isValid = await verifyOtp(userId, orderId, otp);
    if (!isValid) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    const order = await Order.findByIdAndUpdate(orderId, { status: "Confirmed" }, { new: true });
    res.status(200).json({ success: true, message: "OTP verified successfully", order });
  } catch (err) {
    console.error("OTP VERIFY ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
