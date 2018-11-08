const express = require("express");
const router = express.Router();
const passport = require("passport");

const GolfClub = require("../../models/GolfClubs");
const GolfCourse = require("../../models/GolfCourse");

const validateAddGolfClubInput = require("../../validation/addGolfClub");
const validateAddGolfCourseInput = require("../../validation/addGolfCourse");

//@route /golfclub/add
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddGolfClubInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newGolfClub = new GolfClub({
      name: req.body.name,
      description: req.body.description
    });
    newGolfClub
      .save()
      .then(club => res.json(club))
      .catch(err => console.log(err));
  }
);

//@route /golfclub/course/add
router.post(
  "/course/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddGolfCourseInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    GolfClub.findOne({ _id: req.body.clubid }, (err, club) => {
      if (err) throw err;

      const newCourse = {
        name: req.body.name,
        description: req.body.description ? req.body.description : ""
      };
      club.courses.push(newCourse);

      club.save().then(club => res.json(club));
    });
  }
);

//@route /golfclub/course/delete
router.post(
  "/course/delete/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    GolfClub.findById(req.params.clubid, (err, club) => {
      if (err) res.status(500).send(err);
      console.log(req.params.clubid, req.body.courseid);
      const removeIndex = club.courses
        .map(course => course.id)
        .indexOf(req.body.courseid);

      club.courses.splice(removeIndex, 1);

      club.save().then(club => res.json(club));
    }).catch(err => res.status(404).json(err));
  }
);

//@route /golfclub/course/update/:clubid
router.post(
  "/course/update/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddGolfCourseInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    GolfClub.findById(req.params.clubid, (err, club) => {
      if (err) res.status(500).send(err);
      const updateCourse = club.courses.filter(course => {
        return course.id === req.body.courseid;
      });

      updateCourse[0].name = req.body.name;
      club.save().then(club => res.json(club));
    }).catch(err => res.status(404).json(err));
  }
);

//@route /golfclub/update
router.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddGolfClubInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let club = req.body;
    club.date_updated = new Date();
    GolfClub.findByIdAndUpdate(
      req.body._id,
      { $set: club },
      { new: true }
    ).then(club => res.json(club));
  }
);

//@route /golfclub/get
router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    GolfClub.find({ $query: {}, $sort: { name: -1 } }, (err, clubs) => {
      if (err) throw err;

      res.json(clubs);
    });
  }
);

//@route /golfclub/get/id
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    GolfClub.findById(req.params.id).then(club => {
      res.json(club);
    });
  }
);

//@route  /golfclubs/disable
router.post(
  "/change_status",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const club = {};
    club.is_active = false;
    if (!req.body.is_active) {
      club.is_active = true;
    }

    GolfClub.findByIdAndUpdate(
      req.body._id,
      { $set: club },
      { new: true }
    ).then(club => res.json(club));
  }
);

//@route /golfclub/delete
router.post(
  "/delete/:club_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    GolfClub.findByIdAndRemove(req.params.club_id, err => {
      if (err) res.status(500).send(err);

      res.json({ message: "success" });
    });
  }
);

module.exports = router;
