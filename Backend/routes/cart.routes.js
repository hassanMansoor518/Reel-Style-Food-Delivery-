const { auth } = require("../middleware/auth.middleware");

const express = require("express");
const router = express.Router();
const controller = require("../controller/cart.controller");


router.post("/add", auth, controller.addToCart);
router.get("/get", auth, controller.getCart);
router.put("/increase/:id", auth, controller.increaseQty);
router.put("/decrease/:id", auth, controller.decreaseQty);
router.delete("/delete/:id", auth, controller.deleteItem);

module.exports = router;