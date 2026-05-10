const Notification = require("../model/notification.model");

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.status(200).json({ success: true, notifications });
    } catch (err) {
        console.error("GET NOTIFICATIONS ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (err) {
        console.error("DELETE NOTIFICATION ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
