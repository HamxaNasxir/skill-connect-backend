const express = require("express");
const router = express.Router();
const controller = require("./controller");

const { getContactInfo, updateContactInfo } = controller;

router.get("/contact/:id", getContactInfo);
router.put("/contact", updateContactInfo);

module.exports = router;
