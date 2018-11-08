const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const EventTypes = require("../../models/EventTypes");

router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    EventTypes.find().then(eventTypes => {
      res.json(eventTypes);
    });
  }
);

module.exports = router;
