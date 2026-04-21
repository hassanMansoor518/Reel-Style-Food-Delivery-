const partnerModel = require('../model/foodPartner.model');
const foodModel = require('../model/food.model');

async function getFoodPartnerById(req, res) {
  try {
    const foodPartnerId = req.params.id;

    // Validate ObjectId format (24 hex chars)
    if (!foodPartnerId || !foodPartnerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid FoodPartner ID" });
    }

    const foodPartner = await partnerModel.findById(foodPartnerId);
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

    if (!foodPartner) {
      return res.status(404).json({ message: "Food partner not found" });
    }

    res.status(200).json({
      message: "Food partner retrieved successfully",
      foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItemsByFoodPartner
      }
    });

  } catch (error) {
    console.error("Error in getFoodPartnerById:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = {
  getFoodPartnerById
};
