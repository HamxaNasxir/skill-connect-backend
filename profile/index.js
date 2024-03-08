const express = require('express');
const router = express.Router();
const {upload} = require("../middlewares/multerMiddlewares")
const controller = require('./controller');

// Importing our controllers
const {
    createProfile,
    getProfiles,
    getProfileForHomePage,
    updateProfiles,
    deleteProfile,
    getUserDetail,
    getProfileByUserId,
    createProfileImageTest,
    updateProfilesImageTest,
    getAllUser
} = controller;

// making the routes
router.post('/', createProfile);
router.post('/test',upload.single("picture"), createProfileImageTest); //new route for testing
router.get("/home", getProfileForHomePage)
router.get("/setting/:userId", getUserDetail)
router.get("/user/:userId", getProfileByUserId)
router.get("/alluser", getAllUser)
router.put("/test/:id",upload.single("picture"), updateProfilesImageTest) // new route for testing
router.route("/:id").get(getProfiles).put(updateProfiles).delete(deleteProfile)
// router.route("/:id").get(getProfiles).put(upload.single("picture"), updateProfiles).delete(deleteProfile)


module.exports = router