const asyncHandler = require("express-async-handler");
const Profile = require("./model");
const User = require("../user/model")
const Contract = require("../contract/model")

//  @desc   :  Create Profile
//  @Route  :  POST /profile
//  @access :  Public
const createProfile = asyncHandler(async (req, res) => {
  const {userId} = req.body
  try {
    const picture = req.file?.filename;
    console.log("Picture :", picture)

    const newProfile = new Profile({
      ...req.body,
      picture,
    });

    const result = await newProfile.save();

    await User.updateOne({_id:userId},{profileId:result?._id},{new:true});
    
    res.status(200).json(result);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Customizing validation error message
      const errorMessage = Object.values(error.errors)[0].message;
      return res.status(400).json({ error: errorMessage });
    }
    // Handle other types of errors
    res.status(500).json({ error: error.message });
  }
});

//  @desc   :  Get Profile
//  @Route  :  GET /profile/:id
//  @access :  Public
const getProfiles = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const userProfile = await Profile.findById(id).exec();

  if (userProfile) {
    res.status(200).json(userProfile);
  } else {
    res.status(500).json("Profile Not Found");
  }
});

//  @desc   :  Get Profile For HomePage of Client
//  @Route  :  GET /profile/home
//  @access :  Public
const getProfileForHomePage = asyncHandler(async (req, res) => {
  try {
    const profiles = await Profile.find().populate("userId");
    const responseData = await Promise.all(profiles.map(async (item) => {
      const languages = item.language.map(langObject => Object.keys(langObject)).flat();
      const contract = await Contract.countDocuments({ clientId: item?.userId?._id, status: "Completed" });
  
      const data = {
        _id: item?._id,
        username: item?.userId?.username,
        location: item?.userId?.country,
        budget: item?.rate || null,
        languages,
        project: contract,
        image: item?.picture || null
      };
      return data;
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});


//  @desc   :  Update Profile
//  @Route  :  PUT /profile/:id
//  @access :  Public
const updateProfiles = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const picture = req.file?.filename;

  const profile = await Profile.updateOne(
    { _id: id },
    {
      $set: { ...req.body, picture },
    },
    { new: true }
  );

  if (!profile) {
    res.status(400);
    throw new Error("Profile Not Found");
  }

  res.status(200).json("Profile has been updated!");
});

//  @desc   :  Delete Profile
//  @Route  :  DELETE /profile/:id
//  @access :  Public
const deleteProfile = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deletedUser = await Profile.deleteOne({ _id: id });
  if (!deletedUser) {
    return res.status(401).send("Profile not found!");
  } else {
    return res.status(200).send("Deletion Successful!");
  }
});

module.exports = {
  createProfile,
  getProfiles,
  getProfileForHomePage,
  updateProfiles,
  deleteProfile,
};
