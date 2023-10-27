const express = require("express");
const router = express.Router();
const { uploadFile } = require("../middlewares/multerMiddlewares");
const controller = require("./controller");

const { createChat, findChat, userChat, createMessage, getMessages } =
  controller;

router.post("/", createChat);
router.post("/message", uploadFile.single("file"), createMessage);
router.get("/message/:chatId", getMessages);
router.get("/:userId", userChat);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
