const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  callDuration: {
    type: String,
  },
  language: [],
});

const Job = mongoose.model("jobs", jobSchema);

module.exports = Job;
