const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: "partner" },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending | confirmed | failed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);



