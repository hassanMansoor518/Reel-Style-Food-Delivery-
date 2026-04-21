const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "food",
    required: true,
  },
  name: String,
  price: Number,
  qty: { type: Number, default: 1 },
  image: String,
});

module.exports = mongoose.model("cart", cartSchema);



