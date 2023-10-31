const asyncHandler = require("express-async-handler");
const ChatModel = require("./chatModel");
const MessageModel = require("./messageModel");
const createMessageNotification = require("../utils/createMessageNotification");

// --------------------------------------- CHATS ------------------------------------------------------

//  @desc   :  Create Chat
//  @Route  :  POST /chats
//  @access :  Public
const createChat = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    if (!senderId && !receiverId) {
      res.status(500);
      throw new Error("SenderId or ReceiverId not available");
    }

    // Check if a chat with the same members already exists
    const existingChat = await ChatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      // Chat already exists, return the existing chat details
      res.status(200).json(existingChat);
    } else {
      // Chat doesn't exist, create a new chat
      const newChat = new ChatModel({
        members: [senderId, receiverId],
      });

      const result = await newChat.save();
      res.status(200).json(result);
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      // Customizing validation error message
      const errorMessage = Object.values(error.errors)[0].message;
      return res.status(400).json({ error: errorMessage });
    }

    res.status(500).json({ error: error.message });
  }
});

//  @desc   :  Get User Chat
//  @Route  :  GET /chats/:userId
//  @access :  Public
const userChat = asyncHandler(async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    }).populate({path:"members", select:"-password", populate:"profileId"});

    res.status(200).json(chat);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//  @desc   :  Find User Chat - No USING IT
//  @Route  :  GET /chats/find/:firstId/:secondId
//  @access :  Public
const findChat = asyncHandler(async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// --------------------------------------- MESSAGES ------------------------------------------------------

//  @desc   :  Create Message
//  @Route  :  POST /chats/message
//  @access :  Public
const createMessage = asyncHandler(async (req, res) => {
  const { chatId, senderId, senderType, receiverId } = req.body;
  const text = req.body?.text;
  const isFile = req.body?.isFile;
  const file = req.file?.filename;

  try {
    if (text) {
      const message = new MessageModel({
        chatId,
        senderId,
        text,
        senderType,
      });

      const result = await message.save();
      createMessageNotification({chatId, senderId, receiverId})
      res.status(200).json(result);
    } else {
      const message = new MessageModel({
        chatId,
        senderId,
        text: file,
        senderType,
        isFile: true,
      });

      const result = await message.save();
      res.status(200).json(result);
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      // Customizing validation error message
      const errorMessage = Object.values(error.errors)[0].message;
      return res.status(400).json({ error: errorMessage });
    }

    res.status(500);
    throw new Error(error.message);
  }
});

//  @desc   :  Get Message
//  @Route  :  GET /chats/message/:chatId
//  @access :  Public
const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await MessageModel.find({ chatId }).populate({
      path: "senderId",
      select: "-password",
      populate:"profileId"
    });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  createChat,
  findChat,
  userChat,
  getMessages,
  createMessage,
};
