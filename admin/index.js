const express = require("express");
const router = express.Router();
const controller = require("./controller");

const {
getAllClient,
getAllTranslator,
deleteUser,
updateUser,
getTranslatorCard,
updatePayment,
ViewClearedPayment
} = controller;

// router.route("/").post(createContract).put(contractDecision);
router.get("/user/client", getAllClient);
router.get("/user/translator", getAllTranslator);
router.get("/payment", getTranslatorCard);
router.delete("/user/:id", deleteUser);
router.put("/user/:id", updateUser);
router.put("/payment/:id", updatePayment);

////
router.get("/admin/clearhistory", ViewClearedPayment);
// router.get("/:status/:id",getContract)
// router.get("/chat/:userId/:clientId",getContractByUserID)

module.exports = router;