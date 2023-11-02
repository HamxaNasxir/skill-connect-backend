const express = require("express");
const router = express.Router();
const controller = require("./controller")

// Importing our controllers
const { 
    registerUser,
    loginUser,
    signInWithGoogle
} = controller;

// making the routes
router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/google", signInWithGoogle);

module.exports = router;