const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Location = require("../models/Location");
const Task = require("../models/Task");
const Job = require("../models/Job");
const ensureLogin = require("connect-ensure-login");
const checkBoss = require("../passport/roles");
const moment = require("moment");

router.get("/", checkBoss, (req, res, next) => {
  res.render("../views/planner/list.hbs", { layout: false, userId: req.user._id })
});

router.get("/create/job", checkBoss, (req, res, next) => {
  Location.create({
    location: {
      type: "Point",
      coordinates: [40.387493, -3.691193]
    }
  }).then(location => {
    Job.create({
      creator: req.user._id,
      description: "",
      start_date: new Date(),
      end_date: new Date(),
      location: location._id
    }).then(createdJob => {
      res.redirect("/planner/create/job/" + createdJob._id);
    });
  });
});

router.get("/create/job/:id", (req, res) => {
  User.find().then(users => {
    Job.findById(req.params.id).then(job => {
      res.render("../views/planner/create-job", {
        job,
        users,
        apiKey: process.env.MAPS_API_KEY
      });
    });
  });
});

router.get("/update/job/:id", (req, res, next) => {
  User.find().then(users => {
    Job.findById(req.params.id).then(job => {
      res.render("../views/planner/create-job", {
        job,
        users,
        apiKey: process.env.MAPS_API_KEY,
        dateS: moment(job.start_date).format("YYYY-MM-DD"),
        dateE: moment(job.end_date).format("YYYY-MM-DD")
      });
    });
  });
});

router.post("/create/task", checkBoss, (req, res, next) => {
  let newTaskInfo = null;
  let newTask = { ...req.body };
  newTask.creator = req.user._id;
  Task.create(newTask).then(result => {
    newTaskInfo = result;
    Job.findByIdAndUpdate(req.body.jobId, {
      $push: { tasks: result._id }
    }).then(() => {
      res.json(newTaskInfo);
    });
  });
});

router.delete("/delete/task/", checkBoss, (req, res, next) => {
  console.log(req.body);
  Job.findByIdAndUpdate(req.body.jobId, {
    $pull: { tasks: req.body.taskId }
  }).then(result => res.json(result));
});

router.put("/update/task", (req, res, next) => {
  console.log(req.body.operator)
  Task.findByIdAndUpdate(req.body.taskId, {
    name: req.body.name,
    description: req.body.description,
    materials: req.body.materials,
    duration: req.body.duration,
    ocation: req.body.location,
    operator: req.body.operator
  }).then(result => res.json(result));
});

router.put("/update/job", (req, res, next) => {
  Job.findByIdAndUpdate(req.body.jobId, {
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  }).then(result => {
    Location.findByIdAndUpdate(req.body.location, {
      location: {
        type: "Point",
        coordinates: [+req.body.lat, +req.body.lng]
      }
    }).then(result => res.json(result)) 
  });
});

router.get("/task/", (req, res, next) => {
  Task.findById(req.query.id)
    .populate("location")
    .populate("operator")
    .populate("creator")
    .then(task => res.json(task));
});

module.exports = router;
