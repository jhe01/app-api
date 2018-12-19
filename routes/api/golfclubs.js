const express = require("express");
const router = express.Router();
const passport = require("passport");

const GolfClub = require("../../models/GolfClubs");
const GolfCourse = require("../../models/GolfCourse");

const validateAddGolfClubInput = require("../../validation/addGolfClub");
const validateAddGolfCourseInput = require("../../validation/addGolfCourse");
const GolfClubRecentEventAlbum = require("../../models/GolfClubRecentEventAlbum");

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
      description: req.body.description,
      address: req.body.address,
      maintenance_day: req.body.maintenance_day
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

//@route /golfclub/image/update/:clubid/:type
router.post(
  "/image/update/:clubid/:type",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateAddGolfCourseInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    GolfClub.findById(req.params.clubid, (err, club) => {
      if (err) res.status(500).send(err);
      if (req.params.type === "fairway") {
        const updateFwy = club.fairway_images.filter(fwyImage => {
          return fwyImage.id === req.body.id;
        });

        updateFwy[0].caption = req.body.caption;
      } else if (req.params.type === "facility") {
        const updateFclty = club.facility_images.filter(fclty => {
          return fclty.id === req.body.id;
        });

        updateFclty[0].caption = req.body.caption;
      } else {
        return res.status(500).json({ err: "Type is invalid" });
      }
      club.save().then(club => res.json(club));
    }).catch(err => res.status(404).json(err));
  }
);

//@route /golfclub/policy/add/:clubid
router.post(
  "/policy/add/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateAddGolfCourseInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    GolfClub.findOne({ _id: req.params.clubid }, (err, club) => {
      if (err) throw err;

      const newPolicy = {
        name: req.body.name
      };
      club.policies.push(newPolicy);

      club.save().then(club => {
        res.json(club.policies);
      });
    });
  }
);

//@route /golfclub/policy/delete/:clubid
router.post(
  "/policy/delete/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    GolfClub.findById(req.params.clubid, (err, club) => {
      if (err) res.status(500).send(err);

      const removeIndex = club.policies
        .map(policy => policy.id)
        .indexOf(req.body.policyid);

      club.policies.splice(removeIndex, 1);

      club.save().then(club => res.json(club.policies));
    }).catch(err => res.status(404).json(err));
  }
);

//@route /golfclub/policy/update/:clubid
router.post(
  "/policy/update/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateAddGolfCourseInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    GolfClub.findById(req.params.clubid, (err, club) => {
      if (err) res.status(500).send(err);
      const updatePolicy = club.policies.filter(policy => {
        return policy.id === req.body.policyid;
      });

      updatePolicy[0].name = req.body.name;
      updatePolicy[0].is_allowed = req.body.is_allowed;
      club.save().then(club => {
        const rPolicy = club.policies.filter(policy => {
          return policy.id === req.body.policyid;
        });
        res.json(rPolicy);
      });
    }).catch(err => res.status(404).json(err));
  }
);

//@route /golfclubs/service/add/:clubid
router.post(
  "/service/add/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateAddGolfCourseInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    GolfClub.findOne({ _id: req.params.clubid }, (err, club) => {
      if (err) throw err;

      const newService = {
        name: req.body.name
      };
      club.services.push(newService);

      club.save().then(club => res.json(club.services));
    });
  }
);

//@route /golfclubs/service/delete
router.post(
  "/service/delete/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    GolfClub.findById(req.params.clubid, (err, club) => {
      if (err) res.status(500).send(err);

      const removeIndex = club.services
        .map(service => service.id)
        .indexOf(req.body.serviceid);

      club.services.splice(removeIndex, 1);

      club.save().then(club => res.json(club.services));
    }).catch(err => res.status(404).json(err));
  }
);

//@route /golfclubs/service/update/:clubid
router.post(
  "/service/update/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateAddGolfCourseInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    GolfClub.findById(req.params.clubid, (err, club) => {
      if (err) res.status(500).send(err);

      const updateService = club.services.filter(service => {
        return service.id === req.body.serviceid;
      });

      updateService[0].name = req.body.name;
      club.save().then(club => {
        const rService = club.services.filter(service => {
          return service.id === req.body.serviceid;
        });

        res.json(rService);
      });
    }).catch(err => res.status(404).json(err));
  }
);

//@route /golfclub/facility/add
router.post(
  "/facility/add/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateAddGolfCourseInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    GolfClub.findOne({ _id: req.params.clubid }, (err, club) => {
      if (err) throw err;

      const newFacility = {
        name: req.body.name
      };
      club.facilities.push(newFacility);

      club.save().then(club => res.json(club.facilities));
    });
  }
);

//@route /golfclub/facility/delete
router.post(
  "/facility/delete/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    GolfClub.findById(req.params.clubid, (err, club) => {
      if (err) res.status(500).send(err);

      const removeIndex = club.facilities
        .map(facility => facility.id)
        .indexOf(req.body.facilityid);

      club.facilities.splice(removeIndex, 1);

      club.save().then(club => res.json(club.facilities));
    }).catch(err => res.status(404).json(err));
  }
);

//@route /golfclub/facility/update/:clubid
router.post(
  "/facility/update/:clubid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateAddGolfCourseInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    GolfClub.findById(req.params.clubid, (err, club) => {
      if (err) res.status(500).send(err);

      const updatFacility = club.facilities.filter(facility => {
        return facility.id === req.body.facilityid;
      });

      updatFacility[0].name = req.body.name;
      club.save().then(club => {
        const rFacility = club.facilities.filter(facility => {
          return facility.id === req.body.facilityid;
        });

        res.json(rFacility);
      });
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
  //passport.authenticate("jwt", { session: false }),
  (req, res) => {
    GolfClub.findById(req.params.id)
      .lean()
      .then(club => {
        GolfClubRecentEventAlbum.find(
          { club_id: req.params.id },
          (err, albums) => {
            club.recent_event_albums = albums;
            res.json(club);
          }
        );
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
