const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentType: {
      type: String,
      enum: ["card", "easypaisa", "jazzcash", "cod"],
      required: true,
    },

    // For Card
    cardNumber: { type: String },
    cardHolder: { type: String },
    expiry: { type: String },
    cvv: { type: String },

    // For Mobile Wallets
    mobileNumber: { type: String },

    // COD has no extra fields
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
