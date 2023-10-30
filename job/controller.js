const asyncHandler = require("express-async-handler");
const Job = require("./model");

const createJob = asyncHandler(async (req, res) => {
  try {
    const Profile = await Job.create({ ...req.body });
    res.status(200).json(Profile);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Customizing validation error message
      const errorMessage = Object.values(error.errors)[0].message;
      return res.status(400).json({ error: errorMessage });
    }
    console.log(error.message);
    res.status(500).json(error.message);
  }
});
module.exports = {
  createJob,
};
