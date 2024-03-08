const express = require("express");
const router = express.Router();
const controller = require("./controller")

// Importing our controllers
const { 
    registerUser,
    loginUser,
    signInWithGoogle,
    logoutUser,
    updateLocation,
    updateAddress,
    updateStripeCard,
    GetAllUsers
} = controller;

// making the routes
router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/google", signInWithGoogle);
router.put("/logout/:userId", logoutUser);
router.put("/location", updateLocation);
router.put("/address", updateAddress);
router.put("/card", updateStripeCard);
router.get("/allusers", GetAllUsers);

module.exports = router;