const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    url: {
        type: String
    },
    text: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isCount: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const Notification = mongoose.model("Notifications", NotificationSchema);

module.exports = Notification;