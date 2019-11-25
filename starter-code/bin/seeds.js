// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Location = require("../models/Location");
const Task = require("../models/Task");
const Job = require("../models/Job");
const bcryptSalt = 10;

let myLocation = null;
let boss = null;
let operator1 = null;
let operator2 = null;
let tasks = null;
let jobs = null;
let taskArray = null;

mongoose
  .connect("mongodb://localhost/taskrain", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

let users = [
  {
    username: "Luis Sanchez",
    password: bcrypt.hashSync("pass", bcrypt.genSaltSync(bcryptSalt)),
    role: "BOSS",
    active: true
  },
  {
    username: "Jose Pérez",
    password: bcrypt.hashSync("hello", bcrypt.genSaltSync(bcryptSalt)),
    role: "OPERATOR",
    active: true
  },
  {
    username: "Juan López",
    password: bcrypt.hashSync("goodbye", bcrypt.genSaltSync(bcryptSalt)),
    role: "OPERATOR",
    active: true
  }
];

User.deleteMany()
  .then(() => {
    return User.create(users);
  })
  .then(usersCreated => {
    console.log(`${usersCreated.length} users created with the following id:`);
    console.log(usersCreated.map(u => u._id));
  })
  .then(() => {
    console.log("Users collection created");
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });

let locations = [
  {
    location: {
      type: "Point",
      coordinates: [40.387493, -3.691193]
    }
  }
];

Location.deleteMany()
  .then(() => {
    return Location.create(locations);
  })
  .then(locationsCreated => {
    console.log(
      `${locationsCreated.length} locations created with the following id:`
    );
    console.log(locationsCreated.map(u => u._id));
  })
  .then(() => {
    console.log("Locations collection created");
    Location.find()
      .then(locations => {
        console.log(locations[0]._id);
        myLocation = locations[0]._id;
        return User.find({ role: "BOSS" });
      })
      .then(bosses => {
        boss = bosses[0]._id;
        return User.find({ role: "OPERATOR" });
      })
      .then(operators => {
        operator1 = operators[0]._id;
        operator2 = operators[1]._id;
        Task.deleteMany()
          .then(() => {
            tasks = [
              {
                name: "Revisión de faros",
                description:
                  "Comprobar el estado de los faros encendiendo todas las lámparas",
                location: myLocation,
                materials: "llave inglesa",
                operator: operator1,
                creator: boss,
                duration: 15,
                status: "ONGOING"
              },
              {
                name: "Comprobar el estado de las ruedas",
                description:
                  "Comprobación de la profundidad de las marcas y de la presión del neumático",
                location: myLocation,
                materials: "regla de medición y manguito con manómetro",
                operator: operator2,
                creator: boss,
                duration: 30,
                status: "COMPLETED"
              }
            ];

            return Task.create(tasks);
          })
          .then(tasksCreated => {
            console.log(
              `${tasksCreated.length} tasks created with the following id:`
            );
            console.log(tasksCreated.map(u => u._id));
          })
          .then(() => {
            console.log("Tasks collection created");
            Task.find().then(tasks => {
              taskArray = tasks.map(task => task._id);
              Job.deleteMany()
                .then(() => {
                  jobs = [
                    {
                      description: "Pre ITV",
                      creator: boss,
                      end_date: "2019-12-02",
                      start_date: "2019-12-01",
                      location: myLocation,
                      tasks: taskArray
                    }
                  ];
                  return Job.create(jobs);
                })
                .then(jobsCreated => {
                  console.log(
                    `${jobsCreated.length} jobs created with the following id:`
                  );
                  console.log(jobsCreated.map(u => u._id));
                })
                .then(() => {
                  console.log("Jobs collection created");
                })
                .catch(err => {
                  mongoose.disconnect();
                  throw err;
                })
                .then(() => {
                  // Close properly the connection to Mongoose
                  mongoose.disconnect();
                });
            });
          })
          .catch(err => {
            mongoose.disconnect();
            throw err;
          });
      });
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });
