const express = require('express');
const router = express.Router();
const {upload} = require("../middlewares/multerMiddlewares")
const controller = require('./controller');

// Importing our controllers
const {
    createProfile,
    getProfiles,
    updateProfiles,
    deleteProfile
} = controller;

// making the routes
router.post('/',upload.single("picture"), createProfile);
router.route("/:id").get(getProfiles).put(upload.single("picture"), updateProfiles).delete(deleteProfile)


module.exports = router