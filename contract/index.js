const express = require("express");
const router = express.Router();
const controller = require("./controller");

const {
createContract,
getContract,
contractDecision,
getInvitations,
getContractByUserID,
getOverallOrders
} = controller;

router.route("/").post(createContract).put(contractDecision);
router.get("/:id", getInvitations)
router.get("/:status/:id",getContract)
router.get("/chat/:userId/:clientId",getContractByUserID)
router.get("/overallcontracts/client/:id" , getOverallOrders)

module.exports = router;