const express = require("express");
const routes = express.Router();
const controller = require("./controller");

const { createJob, getJoById, getJobsByUserID } = controller;

routes.post("/", createJob);
routes.get("/:id", getJoById);
routes.get("/user/:id", getJobsByUserID);

module.exports = routes;
