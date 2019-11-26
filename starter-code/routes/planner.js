const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Location = require("../models/Location");
const Task = require("../models/Task");
const Job = require("../models/Job");
const ensureLogin = require("connect-ensure-login");
const checkBoss = require("../passport/roles");
const SessionJob = require("../public/javascripts/Job");
const SessionTask = require("../public/javascripts/Task");

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
    .then(joblist => res.render("../views/planner/list.hbs", { layout: false, joblist }));
});

router.get("/create/job", checkBoss, (req, res, next) => {
  if (!req.session.hasOwnProperty("job")) {
    req.session.job = new SessionJob();
  }
  res.render("../views/planner/create-job", req.session.job);
});

router.post("/create/job", (req, res, next) => {
  let job = { ...req.session.job, ...req.body };
  Job.create(job).then(result => {
    delete req.session.job;
    res.redirect("/");
  });
});

router.get("/create/task", checkBoss, (req, res, next) => {
  User.find().then(users =>
    res.render("../views/planner/create-task", { users })
  );
});

router.post("/create/task", checkBoss, (req, res, next) => {
  let task = { ...new Task(), ...req.body };
  req.session.job.tasks.push(task);
  res.redirect("/create/job");
});

router.delete("/delete/task", checkBoss, (req, res, next) => {
  req.session.job.tasks.splice(req.query.idx, 1);
  res.redirect("/create/job");
});

router.get("/update/task", (req, res, next) => {
  res.render(
    "../views/planner/update-task.hbs",
    req.session.job.tasks[req.query.idx]
  );
});

router.put("/update/task", (req, res, next) => {
  let task = { ...new Task(), ...req.body.data }; //ojo al crear el objeto que manda axios
  req.session.job.task[req.body.idx] = task;
  res.redirect("/create/job");
});

// endpoint: "/update/job/:id" get
// pinta la vista update-job con los datos obtenidos al interrogar a
// la base de datos con el req.param.id

// endpoint: "/update/job" put
// actualiza la base de datos con los datos del formulario
// después te redirecciona a "/"

// endpoint: "/delete/job" delete
// elimina todas las tasks que pertenecen a este trabajo
// eliminamos la location
// eliminamos el trabajo
// redireccionamos a "/"

// endpoint: "/create/task/:id" get
// pinta la vista create-task utilizando información de la base de datos
// y req.param.id. El id es el del trabajo al que va a pertenecer esta tarea

// endpoint: "/create/task/:id" post
// El id es el del trabajo al cual le vamos a añadir una nueva tarea a
// partir del formulario.
// Nos redirige a "/update/job/:id"

// endpoint: "/update/task/:job_id/:task_id" get
// pinta update-task con los datos de la base de datos para
// la task que corresponde al task_id que le hemos pasado

// endpoint: "/update/task/:job_id/:task_id" put
// actualiza en la base de datos la tarea correspodiente al task_id
// de la tarea
// redirigimos a /update/job/:id pasándole el job_id (req.param.job_id)

// endpoint: "/delete/task/:job_id/:task_id" delete
// elimina de la base de datos la tarea que tenga task_id
// redirigimos a /update/job/:id pasándole el job_id (req.param.job_id)

module.exports = router;
