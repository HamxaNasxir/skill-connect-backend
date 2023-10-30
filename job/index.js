const express = require("express");
const routes = express.Router();
const controller = require("./controller");

const { createJob, getJobById, getJobByUserID } = controller;

routes.post("/", createJob);
routes.get("/:id", getJobById);
routes.get("/user/:id", getJobByUserID);

module.exports = routes;
