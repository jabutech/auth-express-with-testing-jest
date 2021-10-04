// (1) Import
// package router and multer for handle form request
const router = require("express").Router();
const multer = require("multer");
// (2) Import register controller
const authController = require("./controller");

// Package passport and passport-local for handle login
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy({ usernameField: "username" }, authController.localStrategy)
);

// (3) Route
// endpoint register
router.post("/register", multer().none(), authController.register);
// endpoint login
router.post("/login", multer().none(), authController.login);

// (4) export router
module.exports = router;
