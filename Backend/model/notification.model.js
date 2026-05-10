const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "info", // e.g., info, success, warning, error
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("notification", notificationSchema);
