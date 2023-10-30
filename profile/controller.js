const asyncHandler = require("express-async-handler");
const Profile = require("./model");

//  @desc   :  Create Profile
//  @Route  :  POST /profile
//  @access :  Public
const createProfile = asyncHandler(async (req, res) => {
  try {
    const picture = req.file?.filename;

    const newProfile = new Profile({
      ...req.body,
      picture,
    });

    const result = await newProfile.save();
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

const getProfileForHomePage = asyncHandler(async(req,res)=>{
  const profiles=await Profile.find().populate("userId");
  
  const response = profiles.map(item => {
    const languages = item.language.map(langObject => Object.keys(langObject)).flat();
    const data = {
      _id: item?._id,
      username: item?.userId?.username,
      location: item?.userId?.country,
      budget: item?.rate,
      languages,
      project: 0,
      rating: 0,
      image:item?.picture ? `${process.env.IMAGE_URL}/${item?.picture}` :  null
    };
    return data;
  });

  res.status(200).json(response);
})

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
