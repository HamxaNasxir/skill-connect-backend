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

router.route("/").post(createContract).put(contractDecision);
router.get("/:id", getInvitations)
router.get("/:status",getContract)
router.get("/chat/:userId/:clientId",getContractByUserID)

module.exports = router;