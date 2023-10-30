const express = require("express");
const router = express.Router();
const controller = require("./controller");

const {
    createNotication,
    getNotification,
    readNotification,
    viewNotification,
    deleteNotification
} = controller;

router.post("/", createNotication);
router.put("/view/:id", viewNotification)
router.route("/:id").get(getNotification).put(readNotification).delete(deleteNotification)

module.exports = router;