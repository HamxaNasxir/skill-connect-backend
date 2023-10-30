const express = require("express");
const routes = express.Router();
const controller = require("./controller");

const { createJob } = controller;

routes.post("/", createJob);

module.exports = routes;
