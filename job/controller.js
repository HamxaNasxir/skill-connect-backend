const asyncHandler = require("express-async-handler");
const Job = require("./model");

const createJob = asyncHandler(async (req, res) => {
  try {
    const jobs = await Job.create({ ...req.body });
    res.status(200).json(jobs);
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

const findJobbyId = asyncHandler(async (req, res) => {
  try {
    // const id = req.params.id;
    const jobs = await Job.findbyId(id);
  } catch (error) {}
});
module.exports = {
  createJob,
};
