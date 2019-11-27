const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const checkBoss = require("../passport/roles");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/split",      
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/split", (req, res, next) => {
  if(req.user.role === "BOSS"){
    res.redirect("/planner/");
  }else{
    res.redirect("/tasks/");
  }
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
