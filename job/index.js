const express = require("express");
const routes = express.Router();
const controller = require("./controller");

const { createJob, getJobById, getJobByUserID, updateJob, deleteJob, getJobTitleByUserID } =
  controller;

routes.post("/", createJob);
routes.route("/:id").get(getJobById).put(updateJob).delete(deleteJob);
routes.get("/user/:id", getJobByUserID);
routes.get("/title/:id", getJobTitleByUserID);

module.exports = routes;
