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
        res.render("tasks/detail", { task: task });
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
  "/location/:id",
  ensureLogin.ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    Locations.findById(req.params.id)
    .then((location) => {
      console.log(location);
      res.render("tasks/map", {location: location})
    })
  }
);

// endpoint: "/location" put
// actualiza la ubicación de la tarea en la base de datos.
// En este caso no pinta redirige el marcador res.redirect "/detail"

router.put(
  "/location",
  ensureLogin.ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    res.render("tasks/map");
  }
);

// endpoint: "/confirm/:id" get
// pinta una vista con el botón de confirmación y otro de cancelar

// endpoint: "/confirm/cancel" get
// redirecciona a "/"

// endpoint: "/confirm/ok" put
// actualiza el estado de la tarea a completada y te redirige a "/"

module.exports = router;
