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
  delete req.session.job;
  Job.find()
    .populate("creator")
    .find({ creator: { _id: req.user._id } })
    .populate("tasks")
    .populate({
      path: "tasks",
      populate: { path: "operator" }
    })
    .then(joblist =>
      res.render("../views/planner/list.hbs", { layout: false, joblist })
    );
});

router.get("/create/job", checkBoss, (req, res, next) => {
  Job.create({
    creator: req.user._id,
    description: "dummy text",
    start_date: new Date(),
    end_date: new Date()
  }).then(createdJob => {
    res.redirect("/planner/create/job/" + createdJob._id);
  });
});

router.get("/create/job/:id", (req, res) => {
  User.find().then(users => {
    Job.findById(req.params.id).then(job => {
      res.render("../views/planner/create-job", { job, users, apiKey: process.env.MAPS_API_KEY  });
    });
  });
});

router.get("/create/task", checkBoss, (req, res, next) => {
  User.find().then(users =>
    res.render("../views/planner/create-task", { users })
  );
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

router.get("/update/task", (req, res, next) => {
  res.render(
    "../views/planner/update-task.hbs",
    req.session.job.tasks[req.query.idx]
  );
});

router.put("/update/task", (req, res, next) => {
  Task.findByIdAndUpdate(req.body.taskId, {
    name: req.body.name,
    description: req.body.description,
    materials: req.body.materials,
    duration: req.body.duration,
    ocation: req.body.location,
    operator: req.body.operator
  }).then(result => res.json(result));
});

router.get("/update/job/:id", (req, res, next) => {
  Job.findById(req.params.id).then(job => {
    res.render("../views/planner/create-job", {
      job,
      dateS: moment(job.start_date).format("YYYY-MM-DD"),
      dateE: moment(job.end_date).format("YYYY-MM-DD")
    });
  });
});

router.put("/update/job", (req, res, next) => {
  Job.findByIdAndUpdate(req.body.jobId, {
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  }).then(result => res.json(result));
});

router.get("/task/", (req, res, next) => {
  Task.findById(req.query.id)
    .populate("location")
    .populate("operator")
    .populate("creator")
    .then(task => res.json(task));
});

module.exports = router;
