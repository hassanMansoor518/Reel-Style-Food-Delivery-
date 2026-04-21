const Order = require("../model/order.model");
const Payment = require("../model/payment.model");
const Cart = require("../model/cart.model");   // ⭐ cart model added

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

    // CREATE ORDER
    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      paymentMethod,
      cardDetails: paymentMethod === "card" ? cardDetails : null,
      status: "pending",
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
