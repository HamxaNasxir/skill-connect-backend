const asyncHandler = require("express-async-handler");
const Job = require("./model");

//  @desc   :  Create Job
//  @Route  :  POST /jobs
//  @access :  Public
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

//  @desc   :  Get Job
//  @Route  :  GET /jobs/:id
//  @access :  Public
const getJobById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await Job.findById(id).exec();

    if (!jobs) {
      res.status(500).json("Job not found.");
    }

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//  @desc   :  Get Job By UserId
//  @Route  :  GET /jobs/user/:id
//  @access :  Public
const getJobByUserID = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await Job.find({ userId: id }).sort({ createdAt: -1 }).exec();

    if (!jobs) {
      res.status(500).json("No jobs found.");
    } else {
    }

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//  @desc   :  Update Job
//  @Route  :  PUT /jobs/:id
//  @access :  Public
const updateJob = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await Job.updateOne(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );

    if (!jobs) {
      res.status(400);
      throw new Error("Job not found.");
    }
    res.status(200).json("Job has been updated.");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//  @desc   :  Delete Job
//  @Route  :  DELETE /jobs/:id
//  @access :  Public
const deleteJob = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const jobs = await Job.deleteOne({ _id: id });
    if (!jobs) {
      res.status(400);
      throw new Error("Job not found.");
    }
    res.status(200).json("Job has been deleted.");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = {
  createJob,
  getJobById,
  getJobByUserID,
  updateJob,
  deleteJob,
};
