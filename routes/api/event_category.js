const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const EventCategory = require("../../models/EventCategory");

router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    EventCategory.find().then(category => {
      res.json(category);
    });
  }
);

module.exports = router;
