const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    chatId: {
        type: mongoose.Types.ObjectId,
        ref: "Chats",
        required:true
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    senderType: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const messageModel = mongoose.model("Messages", messageSchema);

module.exports = messageModel