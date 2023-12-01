const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    chatId: {
      type: mongoose.Types.ObjectId,
      ref: "Chats",
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    senderType: {
      type: String,
      required: true,
    },
    isFile: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: String,
      default: "false",
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Messages", messageSchema);

module.exports = messageModel;
