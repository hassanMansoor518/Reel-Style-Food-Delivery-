const express = require("express");
const router = express.Router();
const { userMiddleware } = require("../middleware/auth.middleware");
const { getUserNotifications, deleteNotification } = require("../controller/notification.controller");

router.get("/", userMiddleware, getUserNotifications);
router.delete("/:id", userMiddleware, deleteNotification);

module.exports = router;
