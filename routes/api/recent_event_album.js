const express = require("express");
const router = express.Router();
const passport = require("passport");

const GolfClubRecentEventAlbum = require("../../models/GolfClubRecentEventAlbum");

//@route /album/add/:type
router.post(
  "/add/:type",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    if (req.params.type === "club") {
      const newGolfClubRecentEventAlbum = new GolfClubRecentEventAlbum({
        name: req.body.name,
        club_id: req.body.clubid
      });

      newGolfClubRecentEventAlbum
        .save()
        .then(album => res.json(album))
        .catch(err => res.status(400).json(err));
    }
  }
);

//@route /album/update/:id/:type
router.post(
  "/update/:id/:type",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    if (req.params.type === "club") {
      GolfClubRecentEventAlbum.findByIdAndUpdate(
        req.params.id,
        { $set: { name: req.body.name } },
        { new: true }
      )
        .populate(["club_id"])
        .exec((err, album) => {
          if (err) throw err;

          res.json(album);
        });
    }
  }
);

module.exports = router;
