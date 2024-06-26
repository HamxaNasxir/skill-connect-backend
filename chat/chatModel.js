const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    members: {
      type: [mongoose.Types.ObjectId],
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("Chats", chatSchema);

module.exports = chatModel;
