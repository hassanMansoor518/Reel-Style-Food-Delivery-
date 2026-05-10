const Order = require("../model/order.model");
const Payment = require("../model/payment.model");
const Cart = require("../model/cart.model");
const Notification = require("../model/notification.model");
const Food = require("../model/food.model");

// Save payment & create order
exports.savePayment = async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod, cardDetails, mobileNumber } = req.body;

    // Check cart items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Check payment method
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method required" });
    }

    // Card validation
    if (paymentMethod === "card") {
      if (!cardDetails?.cardNumber || !cardDetails?.name || !cardDetails?.expiry || !cardDetails?.cvv) {
        return res.status(400).json({ message: "Card details required for Card payment" });
      }
    }

    // Mobile wallet validation
    if (paymentMethod === "easypaisa" || paymentMethod === "jazzcash") {
      if (!mobileNumber || !/^\d+$/.test(mobileNumber)) {
        return res.status(400).json({ message: "Valid mobile number required" });
      }
    }

    // FIND PARTNER FROM ITEMS
    let partnerId = null;
    if (items && items.length > 0) {
      const firstItem = await Food.findOne({ name: items[0].name });
      if (firstItem) partnerId = firstItem.foodPartner;
    }

    // CREATE ORDER
    const order = await Order.create({
      user: req.user._id,
      partner: partnerId,
      items,
      totalPrice,
      paymentMethod,
      cardDetails: paymentMethod === "card" ? cardDetails : null,
      status: "pending",
    });

    // CREATE NOTIFICATION
    await Notification.create({
      userId: req.user._id,
      title: "Order Placed",
      description: `Your order #${order._id.toString().slice(-6)} has been placed successfully.`,
      type: "success"
    });

    // SAVE PAYMENT DETAILS
    const payment = await Payment.create({
      userId: req.user._id,
      paymentType: paymentMethod,
      cardNumber: cardDetails?.cardNumber,
      cardHolder: cardDetails?.name,
      expiry: cardDetails?.expiry,
      cvv: cardDetails?.cvv,
      mobileNumber: mobileNumber || undefined,
    });

    // ⭐⭐⭐ CLEAR USER CART AFTER ORDER SUCCESS ⭐⭐⭐
    await Cart.deleteMany({ userId: req.user._id });

    res.status(201).json({
      message: "Order & Payment created, Cart cleared",
      orderId: order._id,
      paymentId: payment._id,
    });

  } catch (err) {
    console.error("SAVE PAYMENT ERROR:", err);
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
};
