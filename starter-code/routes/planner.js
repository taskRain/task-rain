const express = require('express');
const router  = express.Router();

// endpoint: "/" get 
// destruye session.job de la sesión en caso de que exista
// listar todos los trabajos creados por el jefe usando
// la vista list

// endpoint: "/create/job" get 
// muestra el formulario de creación de trabajos
// pintando la vista create-job usando el objeto Job almacenado en la sesión
// Si no existe la propiedad session.job
// crea en la sesión un nuevo objeto de la clase Job (en session.job) para mantener el estado
// del formulario

// endpoint: "/create/job" post 
// crea un nuevo trabajo en la base de datos con los datos del formulario
// destruye la información del objeto Job de la sesión 
// se redirige a "/" (página principal)

// endpoint: "/create/task" get 
// pintamos la vista create-task

// endpoint: "/create/task" post
// crea un nuevo objeto de la clase Task y se lo coloca al objeto Job
// que está en session.job
// Hecho esto hace un redirect a /create/job

// endpoint: "/delete/task/" delete
// recibir por req.query el índice del array de tareas, lo eliminamos del array
// de la sesión y redirigimos a /create/job

// endpoint: "/update/task" get
// pintamos la vista update-task con los datos que obtiene del objeto
// Task que esta dentro del array de Job en la sesión correspondiente
// Indentificamos la tarea pasando el índice del array de tareas por req.query en lugar de 
// por req.param

// endpoint: "/update/task" put
// actualiza la Task del objeto Job que está en session.job con los nuevos 
// datos del formulario y redirige a /create/job

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
