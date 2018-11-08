const express = require("express");
const router = express.Router();
const mgse = require("mongoose");



const udb = require("../../config/keys").uploadMongoURI;
const uUser = require("../../config/keys").uploadUser;
const uPass = require("../../config/keys").uploadPass;

router.get("/", (req, res) => {
  res.send("Success");
});

module.exports = router;
