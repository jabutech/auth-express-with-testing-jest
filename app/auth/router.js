// (1) Import package router and multer for handle form request
const router = require("express").Router();
const multer = require("multer");

// (2) Import register controller
const authController = require("./controller");

// (3) Route for endpoint register new user
router.post("/register", multer().none(), authController.register);

// (4) export router
module.exports = router;