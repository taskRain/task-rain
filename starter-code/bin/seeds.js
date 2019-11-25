// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const bcryptSalt = 10;

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
    username: "Jose",
    password: bcrypt.hashSync("hello", bcrypt.genSaltSync(bcryptSalt)),
    role: "OPERATOR",
    active: true
  }
];

let jobs = [
  {
    description: "Cambio de correa de distribución",
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    end_date: { type: Date, required: true },
    start_date: { type: Date, required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
  },
  {
    description: "Cambio de rueda",
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    end_date: { type: Date, required: true },
    start_date: { type: Date, required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
  },
  {
    description: "Cambio de aceite",
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    end_date: { type: Date, required: true },
    start_date: { type: Date, required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
  },
  {
    description: "Revisión pre-ITV",
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    end_date: { type: Date, required: true },
    start_date: { type: Date, required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
  },
  {
    description: "Sustitución de faro",
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    end_date: { type: Date, required: true },
    start_date: { type: Date, required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
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
  })

  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  });
