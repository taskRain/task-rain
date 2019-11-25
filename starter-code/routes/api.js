const express = require('express');
const router  = express.Router();

// endpoint: "/jobs/:id" get 
// devuleve un json (res.json) que contiene los trabajos creados
// por el usuario con el id que ha entrado (el jefe)

// endpoint: "/tasks/:id" get 
// devuleve un json (res.json) que contiene la lista de
// tareas asignadas al usuario con el id que hemos pasado
// por parámetros
// le pasaremos la descripción de las tareas y el estado de las mismas

module.exports = router;