const express = require("express");
const router = express.Router();

const GolfCourse = require("../../models/GolfCourse");

router.post("/add", (req, res) => {
  const newGolfCourse = new GolfCourse({
    name: req.body.name,
    club_id: req.body.clubid,
    description: req.body.description
  });
  newGolfCourse
    .save()
    .then(club => res.json(club))
    .catch(err => console.log(err));
});

router.get("/get", (req, res) => {
  GolfCourse.find({}, (err, clubs) => {
    if (err) throw err;

    res.json(clubs);
  });
});

router.get("/get_id/:id", (req, res) => {
  GolfCourse.findById(req.params.id).then(club => {
    res.json(club);
  });
});

router.get("/get_clubid/:id", (req, res) => {
  GolfCourse.find({ club_id: req.params.id }, (err, courses) => {
    if (err) throw err;

    res.json(courses);
  });
});

module.exports = router;
