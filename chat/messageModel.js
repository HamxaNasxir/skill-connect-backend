const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    chatId: {
        type: mongoose.Types.ObjectId,
        ref: "Chats"
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    text: {
        type: String
    },
    senderType: {
        type: String
    }
}, {
    timestamps: true
});

const messageModel = mongoose.model("Messages", messageSchema);

module.exports = messageModel