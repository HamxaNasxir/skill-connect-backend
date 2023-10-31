const express = require("express");
const router = express.Router();
const controller = require("./controller");

const {
createContract,
getContract,
contractDecision,
getInvitations,
getContractByUserID
} = controller;

router.route("/").get(getInvitations).post(createContract).put(contractDecision);
router.get("/:status",getContract)
router.get("/chat/:userId/:clientId",getContractByUserID)

module.exports = router;