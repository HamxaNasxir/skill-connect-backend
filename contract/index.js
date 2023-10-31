const express = require("express");
const router = express.Router();
const controller = require("./controller");

const {
createContract,
getContract,
contractDecision,
getInvitations
} = controller;

router.route("/").get(getInvitations).post(createContract).put(contractDecision);
router.get("/:status",getContract)

module.exports = router;