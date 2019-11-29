const express = require("express");
const router = express.Router();
const Tasks = require("../models/Task");
const Locations = require("../models/Location");
const ensureLogin = require("connect-ensure-login");
const checkBoss = require("../passport/roles");

// endpoint: "/" get
// listar las tareas asignadas al usuario en la vista list
router.get("/", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  Tasks.find()
    .populate("operator")
    .find({ operator: { _id: req.user._id } })
    .then(allTheTasks => {
      allTheTasks.forEach((task) => {
        if(task.status === "COMPLETED"){
          task.flag = true;
        }
      })
      res.render("tasks/list", { tasks: allTheTasks });
    })
    .catch(error => {
      console.log(error);
    });
});

// endpoint: "/detail/:id" get
// muestra detalle de la tarea en la vista detail
router.get(
  "/detail/:id",
  ensureLogin.ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    Tasks.findById(req.params.id)
      .populate("location")
      .then(task => {
        res.render("tasks/detail", { task: task , coordsLat: task.location.location.coordinates[0], coordsLng: task.location.location.coordinates[1],  apiKey: process.env.MAPS_API_KEY });
        console.log(task);
      })
      .catch(error => {
        console.log(error);
      });
  }
);

// endpoint: "/location/:id" get
// mostrar mapa con localización. Pintará en la vista map
router.get(
  "/location/:locId/:taskId",
  ensureLogin.ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    Locations.findById(req.params.locId).then(location => {
      console.log(location);
      res.render("tasks/map", { coordsLat: location.location.coordinates[0], coordsLng: location.location.coordinates[1], locationId: location.id, task: req.params.taskId, apiKey: process.env.MAPS_API_KEY });
    });
  }
);

// endpoint: "/location" put
// actualiza la ubicación de la tarea en la base de datos.
// En este caso no pinta redirige el marcador res.redirect "/detail"

router.put(
  "/location",
  ensureLogin.ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    console.log(req.body);
    Locations.findByIdAndUpdate(req.body.id, {
      location: {
        type: "Point",
        coordinates: [+req.body.lat, +req.body.lng]
      }
    }).then((response) => {
      res.json(response);
    });
  }
);


// endpoint: "/confirm/:id" get
// pinta una vista con el botón de confirmación y otro de cancelar
router.get(
  "/confirm/:id",
  ensureLogin.ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    console.log('This is the id');
    console.log(req.params.id);
    res.render("tasks/confirm", { taskId: req.params.id });
  }
);

// endpoint: "/confirm/cancel" get
// redirecciona a "/"
router.get("/confirmCancel", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
  console.log('cancelled');
  res.redirect("/tasks/");
});

// endpoint: "/confirm/ok/:id" put
// actualiza el estado de la tarea a completada y te redirige a "/"
router.put(
  "/confirm/ok",
  ensureLogin.ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    Tasks.findByIdAndUpdate(req.body._id, {
      status: "COMPLETED"
    }).then((response) => {
      // console.log('updated');
      res.json(response);
    });
  }
);

module.exports = router;
