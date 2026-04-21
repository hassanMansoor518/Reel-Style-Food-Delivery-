const express = require('express');
const authMiddleware = require("../middleware/auth.middleware")
const foodPartnerController = require("../controller/foodPartner.controller")
const router = express.Router();


router.get("/:id",
    authMiddleware.foodPartnerMiddleware,
   
    foodPartnerController.getFoodPartnerById
)
router.get("/profile/:id",
     authMiddleware.userMiddleware,
    foodPartnerController.getFoodPartnerById
)
module.exports = router;
// /api/food-partner/:id
// /api/food-partner/profile/:id