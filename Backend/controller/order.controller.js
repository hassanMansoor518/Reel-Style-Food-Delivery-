const Order = require("../model/order.model");
const Notification = require("../model/notification.model");
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

    const formattedOrders = orders.map((order) => {
      const createdAt = new Date(order.createdAt).getTime();
      const now = Date.now();
      const etaMinutes = 5; // Sync with our "fast" speed
      const expiresAt = createdAt + etaMinutes * 60_000;
      const isPast = now >= expiresAt;

      return {
        _id: order._id,
        id: order._id.toString().slice(-8),
        restaurant: order.restaurant || "Food Store",
        status: isPast ? "Delivered" : (order.status || "pending"),
        eta: order.eta || `${etaMinutes} minutes`,
        progress: order.progress || null,
        type: isPast ? "past" : "ongoing",
        createdAt: order.createdAt,
        items: order.items,
        totalItems: order.items.length,
        totalPrice: order.totalPrice,
        name: order.name,
        paymentMethod: order.paymentMethod,
      };
    });

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

    // CREATE NOTIFICATION
    await Notification.create({
      userId: req.user._id,
      title: "Order Confirmed",
      description: `Your order #${order._id.toString().slice(-6)} has been confirmed and is being prepared.`,
      type: "success"
    });
    res.status(200).json({ success: true, message: "OTP verified successfully", order });
  } catch (err) {
    console.error("OTP VERIFY ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Single Order Details for Tracking
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId || orderId === "undefined" || !require("mongoose").Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid Order ID" });
    }

    const order = await Order.findById(orderId).populate("user").populate("partner");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Generate a simulated timeline based on status
    const timeline = [
      { label: "Order Placed", time: "Just now", icon: "✓", completed: true },
      { label: "Confirmed", time: order.status === "Confirmed" ? "A moment ago" : "Pending", icon: "🍴", completed: order.status === "Confirmed" },
      { label: "Preparing", time: "In progress", icon: "🍳", completed: false },
      { label: "On the way", time: "Expected soon", icon: "🏍️", completed: false },
    ];

    res.status(200).json({
      success: true,
      order: {
        id: order._id,
        status: order.status,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        eta: order.eta || "5 min",
        timeline,
        userLocation: { lat: order.user?.lat || 31.5100, lng: order.user?.lng || 74.3300 },
        partnerLocation: { lat: order.partner?.lat || 31.5204, lng: order.partner?.lng || 74.3587 },
      }
    });
  } catch (err) {
    console.error("GET ORDER DETAILS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
