const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const foodController = require("../controller/food.controller");
const multer = require('multer');

const router = express.Router();

// Multer setup for memory storage
const upload = multer({
    storage: multer.memoryStorage()
});

// CREATE FOOD ITEM
router.post(
    "/",
    authMiddleware.foodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood
);

// GET ALL FOOD ITEMS
router.get(
    "/",
    authMiddleware.userMiddleware, // users can view all food items
    foodController.getFoodItem
);

// UPDATE FOOD ITEM
router.put(
    "/:id",
    authMiddleware.foodPartnerMiddleware,
    upload.single("video"),
    foodController.updateFood
);

// DELETE FOOD ITEM
router.delete(
    "/:id",
    authMiddleware.foodPartnerMiddleware,
    foodController.deleteFood
);

module.exports = router;



// app.use("/api/auth",authRoutes)
// app.use("/api/food",foodRoutes)
// app.use("/api/food-partner", foodPartnerRoutes)