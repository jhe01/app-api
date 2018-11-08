const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input Validation

const validateAddUserInput = require("../../validation/addUser");
const validateLoginInput = require("../../validation/login");

const User = require("../../models/Users");

// @route   GET api/users/get
// @desc    Add User
// @access  Private
router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find()
      .populate(["club_id", "role_id"])
      .sort({ date_updated: -1 })
      .exec((err, users) => {
        if (err) throw err;

        res.json(users);
      });
  }
);

// @route   GET api/users/get/:id
// @desc    Add User
// @access  Private
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.params.id).then(user => {
      res.json(user);
    });
  }
);

// @route   GET api/users/add
// @desc    Add User
// @access  Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddUserInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        errors.email = "Email already exist!";
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          name: req.body.name,
          club_id: req.body.clubid,
          role_id: req.body.roleid,
          email: req.body.email,
          password: req.body.password,
          contact: req.body.contact
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // newUser.populate(["club_id", "role_id"]).execPopulate();
            newUser.save((err, user) => {
              if (err) throw err;
              User.findOne(user)
                .populate(["club_id", "role_id"])
                .exec((err, doc) => {
                  if (err) throw err;
                  res.json(doc);
                });
            });
          });
        });
      }
    });
  }
);

// @route   GET api/users/update
// @desc    Add User
// @access  Private
router.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = {};
    user.name = req.body.name;
    user.club_id = req.body.clubid;
    user.role_id = req.body.roleid;
    user.email = req.body.email;
    user.contact = req.body.contact;

    User.findByIdAndUpdate(req.params.id, { $set: user }, { new: true }).then(
      user => res.json(user)
    );
  }
);

// @route   GET api/users/update
// @desc    Add User
// @access  Private
router.post(
  "/change_pass/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = {};
    user.password = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        User.findByIdAndUpdate(
          req.params.id,
          { $set: user },
          { new: true }
        ).then(user => res.json(user));
      });
    });
  }
);

// @route   GET api/users/change_status
// @desc    Change User Status
// @access  Private
router.post(
  "/change_status",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = {};
    user.is_active = false;
    if (!req.body.is_active) {
      user.is_active = true;
    }

    User.findByIdAndUpdate(req.body._id, { $set: user }, { new: true })
      .populate(["club_id", "role_id"])
      .exec((err, user) => {
        res.json(user);
      });
  }
);

// @route   GET api/users/login
// @desc    Login
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const pass = req.body.password;
  // Find user by email
  User.findOne({ email })
    .populate(["role_id", "club_id"])
    .exec((err, user) => {
      if (!user) {
        errors.email = "User not found!";
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt.compare(pass, user.password).then(isMatch => {
        if (isMatch) {
          // User match
          const payload = {
            id: user.id,
            name: user.name,
            role_id: user.role_id,
            club_id: user.club_id
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({ success: true, token: "Bearer " + token });
            }
          );
        } else {
          errors.password = "Password is incorrect";
          return res.status(400).json(errors);
        }
      });
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
