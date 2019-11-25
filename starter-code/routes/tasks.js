const express = require("express");
const router = express.Router();

// endpoint: "/" get
// listar las tareas asignadas al usuario en la vista list

// endpoint: "/detail/:id" get
// muestra detalle de la tarea en la vista detail

// endpoint: "/location/:id" get
// mostrar mapa con localización. Pintará en la vista map

// endpoint: "/location" put
// actualiza la ubicación de la tarea en la base de datos.
// En este caso no pinta redirige el marcador res.redirect "/detail"

// endpoint: "/confirm/:id" get
// pinta una vista con el botón de confirmación y otro de cancelar

// endpoint: "/confirm/cancel" get
// redirecciona a "/"

// endpoint: "/confirn/ok" put
// actualiza el estado de la tarea a completada y te redirige a "/"

module.exports = router;
