const express = require("express");
const router = express.Router();
const controller = require("./controller");

const {
getContactInfo
} = controller

router.get("/contact/:id", getContactInfo);

module.exports = router