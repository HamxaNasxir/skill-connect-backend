const express = require("express");
const routes = express.Router();
const controller = require("./controller");

const { createMeeting,joinMeeting } =
  controller;

routes.post("/join-meeting", joinMeeting);
routes.get("/create-meeting", createMeeting);

module.exports = routes;
