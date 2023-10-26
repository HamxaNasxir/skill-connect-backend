const express = require("express");
const router = express.Router();
const controller = require("./controller")

// Importing our controllers
const { 
    registerUser,
    loginUser
} = controller;

// making the routes
router.post("/", registerUser);
router.post("/login", loginUser);

module.exports = router;