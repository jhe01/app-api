const express = require("express");
const router = express.Router();
const passport = require("passport");

const Roles = require("../../models/Roles");

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newRole = new Roles({
      name: req.body.name,
      description: req.body.description
    });

    newRole
      .save()
      .then(role => res.json(role))
      .catch(err => console.log(err));
  }
);

router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Roles.find({}, (err, roles) => {
      res.json(roles);
    });
  }
);

module.exports = router;
