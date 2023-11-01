const asyncHandler = require("express-async-handler");
const User = require("../user/model");
const Profile = require("../profile/model");

//  @desc   :  Get Contact Information
//  @Route  :  GET /settings/contact/:id
//  @access :  Public
const getContactInfo = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).populate("profileId").exec();

    if (!user) return res.status(404).json(`User of ${id} not found`);

    const filterUser = {
      userId: user?._id || null,
      name: user?.username || null,
      email: user?.email || null,
      number: user?.profileId?.contact || null,
      address: user?.profileId?.address || null,
      country: user?.country || null,
    };

    res.status(200).json(filterUser);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//  @desc   :  Update Contact Information
//  @Route  :  GET /settings/contact
//  @access :  Public
const updateContactInfo = asyncHandler(async (req, res) => {
  const { userId, username, email, contact, address, country } = req.body;

  try {
    const user = await User.findById(userId).populate("profileId");
    if (!user) {
      res.status(400).json(`User with ${userId} not found.`);
    }

    const update = {
      username: username || user?.username,
      email: email || user?.email,
      country: country || user?.country,
    };

    const updateProfile = {
      contact: contact || user?.profileId?.contact,
      address: address || user?.profileId?.address,
    };

    await Profile.updateOne({ userId }, { $set: updateProfile }, { new: true });

    await User.updateOne({ _id: userId }, { $set: update }, { new: true });

    res.status(200).json("updated");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = {
  getContactInfo,
  updateContactInfo,
};
