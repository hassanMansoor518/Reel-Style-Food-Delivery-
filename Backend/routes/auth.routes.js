const express = require("express");
const authController = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const uploadMiddleware = require("../middleware/upload.middleware")
const multer = require("multer");

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage()
});

router.post("/user/register",authController.registerUser)
router.post("/user/login", authController.loginUser )
router.get("/user/logout",authController.logoutUser)
router.get("/user/profile", authMiddleware.userMiddleware, authController.getUserProfile);
router.post("/user/change-password", authMiddleware.userMiddleware, authController.changeUserPassword);

router.post(
  "/user/upload-avatar",
  authMiddleware.userMiddleware,
  upload.single("avatar"),
  authController.uploadUserAvatar
);

router.post("/partner/register",authController.registerPartner)
router.post("/partner/login", authController.loginPartner )
router.get("/partner/logout",authController.logoutPartner)


module.exports = router;