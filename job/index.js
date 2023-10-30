const express = require("express");
const routes = express.Router();
const controller = require("./controller");

const { createJob, getJobById, getJobByUserID, updateJob } = controller;

routes.post("/", createJob);
routes.route("/:id").get(getJobById).put(updateJob);
routes.get("/user/:id", getJobByUserID);

module.exports = routes;
