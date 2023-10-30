const express = require("express");
const router = express.Router();
const controller = require("./controller");

const {
createContract,
getContract
} = controller;

router.post("/", createContract);
router.get("/:status",getContract)

module.exports = router;