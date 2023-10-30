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

const getJobById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await Job.findById(id).exec();

    if(!jobs){
      res.status(500).json("Job not found.");
    }
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json(error.message)
  }
});

const getJobByUserID = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await Job.find({ userId: id }).sort({createdAt:-1}).exec();

    if (!jobs) {
      res.status(500).json("No jobs found.");
    } else {
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = {
  createJob,
  getJobById,
  getJobByUserID,
};
