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
  }
});

const getJoById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await Job.findById(id);
    if (jobs) {
      res.status(200).json(jobs);
    } else {
      res.status(500).json("Job not found.");
    }
  } catch (error) {
    console.log(error.message);
  }
});

const getJobsByUserID = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await Job.find({ userId: id });
    if (jobs) {
      res.status(200).json(jobs);
    } else {
      res.status(500).json("No jobs found.");
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = {
  createJob,
  getJoById,
  getJobsByUserID,
};
