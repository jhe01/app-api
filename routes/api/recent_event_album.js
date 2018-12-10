const express = require("express");
const router = express.Router();
const passport = require("passport");

const GolfClubRecentEventAlbum = require("../../models/GolfClubRecentEventAlbum");

//@route /golfclubalbum/add
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newGolfClubRecentEventAlbum = new GolfClubRecentEventAlbum({
      name: req.body.name,
      club_id: req.body.clubid
    });
    newGolfClubRecentEventAlbum
      .save()
      .then(club => res.json(club))
      .catch(err => console.log(err));
  }
);
module.exports = router;
