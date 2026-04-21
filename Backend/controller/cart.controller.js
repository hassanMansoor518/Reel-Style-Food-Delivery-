const Cart = require("../model/cart.model");
const Food = require("../model/food.model");

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;   // ⭐ user tracking added

    if (!foodId) return res.status(400).json({ msg: "Food ID is required." });

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ msg: "Food item not found." });

    // ⭐ Check cart item only for this user
    const existing = await Cart.findOne({ foodId, userId });

    if (existing) {
      existing.qty++;
      await existing.save();
      return res.json({ msg: "Quantity increased", existing });
    }

    const newCart = await Cart.create({
      userId,
      foodId,
      name: food.name,
      price: food.price,
      image: food.video,
      qty: 1,
    });

    res.json({ msg: "Added to cart", newCart });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get cart items
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.find({ userId });  // ⭐ now user-specific

    res.json({ cart });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Increase qty
exports.increaseQty = async (req, res) => {
  try {
    const userId = req.user._id;

    const item = await Cart.findOne({ _id: req.params.id, userId });

    if (!item) return res.status(404).json({ msg: "Cart item not found" });

    item.qty++;
    await item.save();

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Decrease qty
exports.decreaseQty = async (req, res) => {
  try {
    const userId = req.user._id;

    const item = await Cart.findOne({ _id: req.params.id, userId });

    if (!item) return res.status(404).json({ msg: "Cart item not found" });

    if (item.qty > 1) item.qty--;

    await item.save();

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Delete
exports.deleteItem = async (req, res) => {
  try {
    const userId = req.user._id;

    const item = await Cart.findOne({ _id: req.params.id, userId });
    if (!item) return res.status(404).json({ msg: "Cart item not found" });

    await Cart.findByIdAndDelete(req.params.id);

    res.json({ msg: "Item deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


