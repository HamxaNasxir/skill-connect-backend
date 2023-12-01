const express = require("express");
const router = express.Router();
const { uploadFile } = require("../middlewares/multerMiddlewares");
const controller = require("./controller");

const { createChat, findChat, userChat, createMessage, getMessages, updateUnread, markAsRead } =
  controller;

router.post("/", createChat);
router.post("/message", uploadFile.single("file"), createMessage);
router.get("/message/:chatId", getMessages);
router.get("/:userId", userChat);
router.get("/find/:firstId/:secondId", findChat);
router.put("/update/:chatId/:userId", updateUnread)
router.put("/read/:messageId/:userId", markAsRead)

module.exports = router;
