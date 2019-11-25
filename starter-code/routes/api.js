const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Location = require("../models/Location");
const Task = require("../models/Task");
const Job = require("../models/Job");
const ensureLogin = require("connect-ensure-login");
const checkBoss = require("../passport/roles");

router.get("/jobs/:id", checkBoss, (req, res, next) => {
  Job.find()
    .populate("creator")
    .find({ creator: { _id: req.params.id } })
    .populate("location")
    .populate("tasks")
    .then(payload => res.json(payload));
});

router.get("/tasks/:id", ensureLogin.ensureLoggedIn('/auth/login'),(req, res, next) => {
  Task.find()
    .populate("operator")
    .find({ operator: { _id: req.params.id } })
    .populate("location")
    .then(payload => res.json(payload));
});

module.exports = router;
