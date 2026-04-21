const foodModel = require("../model/food.model")
const storageService = require("../service/storage.service")
const { v4: uuid } = require("uuid")

// CREATE FOOD
async function createFood(req, res) {
    try {
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            price: req.body.price,
            rating: req.body.rating,
            foodPartner: req.foodPartner._id
        })

        res.status(201).json({
            message: "Food item created",
            food: foodItem
        })
    } catch (error) {
        res.status(500).json({ message: "Error creating food item", error: error.message })
    }
}

// GET ALL FOOD ITEMS
async function getFoodItem(req, res) {
    try {
        const foodItems = await foodModel
            .find()
            .populate("foodPartner", "fullName contactName phone email address"); // populate

        res.status(200).json({
            success: true,
            message: "Get all food items with partner info",
            foodItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching food items",
            error: error.message
        });
    }
}



// UPDATE FOOD ITEM
async function updateFood(req, res) {
    try {
        const foodId = req.params.id
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            rating: req.body.rating
        }

        // If a new file is uploaded, update video URL
        if (req.file) {
            const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())
            updateData.video = fileUploadResult.url
        }

        const updatedFood = await foodModel.findByIdAndUpdate(foodId, updateData, { new: true })

        if (!updatedFood) {
            return res.status(404).json({ message: "Food item not found" })
        }

        res.status(200).json({
            message: "Food item updated",
            food: updatedFood
        })
    } catch (error) {
        res.status(500).json({ message: "Error updating food item", error: error.message })
    }
}

// DELETE FOOD ITEM
async function deleteFood(req, res) {
    try {
        const foodId = req.params.id
        const deletedFood = await foodModel.findByIdAndDelete(foodId)

        if (!deletedFood) {
            return res.status(404).json({ message: "Food item not found" })
        }

        res.status(200).json({
            message: "Food item deleted",
            food: deletedFood
        })
    } catch (error) {
        res.status(500).json({ message: "Error deleting food item", error: error.message })
    }
}

module.exports = {
    createFood,
    getFoodItem,
    updateFood,
    deleteFood
}
