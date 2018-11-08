const express = require("express");
const router = express.Router();
const passport = require("passport");

const Event = require("../../models/Events");

const validateAddEventInput = require("../../validation/addEvent");

router.get("/test", (req, res) => {
  res.json({ msg: "Events works" });
});

router.get("/get", (req, res) => {
  Event.find()
    .select({ details: 0 })
    .populate(["club", "eventType", "eventCategory", "banner"])
    .exec((err, events) => {
      if (err) throw err;

      res.json(events);
    });
});

router.post("/get_by_club", (req, res) => {
  Event.find({ club: req.body.clubid })
    .select({ details: 0 })
    .populate(["club", "eventType", "eventCategory", "banner"])
    .exec((err, events) => {
      if (err) throw err;

      res.json(events);
    });
});

router.post("/add", (req, res) => {
  const { errors, isValid } = validateAddEventInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newEvent = new Event({
    title: req.body.title,
    club: req.body.golfClub,
    oneDayOny: req.body.oneDayOnly,
    isWholeDay: req.body.isWholeDay,
    dateOfEvent: req.body.dateOfEvent,
    from: req.body.from,
    timefrom: req.body.timeFrom,
    timeTo: req.body.timeTo,
    to: req.body.to,
    eventType: req.body.eventType,
    eventCategory: req.body.eventCategory,
    numberOfPlayers: req.body.numberOfPlayers,
    details: req.body.details,
    is_active: req.body.is_active,
    is_public: req.body.is_public
  });

  newEvent.save().then(event => res.json(event));
});

router.get("/get/:id", (req, res) => {
  Event.findById(req.params.id)
    .populate(["club", "eventType", "eventCategory", "banner"])
    .exec((err, event) => {
      if (err) throw err;
      res.json(event);
    });
});

router.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddEventInput(req.body);
    let updEvent = {};

    if (!isValid) {
      return res.status(400).json(errors);
    }

    updEvent.title = req.body.title;
    updEvent.club = req.body.golfClub;
    updEvent.oneDayOnly = req.body.oneDayOnly;
    updEvent.isWholeDay = req.body.isWholeDay;
    updEvent.dateOfEvent = req.body.dateOfEvent;
    updEvent.from = req.body.from;
    updEvent.timeFrom = req.body.timeFrom;
    updEvent.timeTo = req.body.timeTo;
    updEvent.to = req.body.to;
    updEvent.eventType = req.body.eventType;
    updEvent.eventCategory = req.body.eventCategory;
    updEvent.numberOfPlayers = req.body.numberOfPlayers;
    updEvent.details = req.body.details;
    updEvent.is_public = req.body.is_public;
    updEvent.date_updated = new Date();
    Event.findByIdAndUpdate(req.params.id, { $set: updEvent }, { new: true })
      .populate(["club", "eventType", "eventCategory"])
      .exec((err, event) => {
        if (err) throw err;

        res.json(event);
      });
  }
);

router.post(
  "/change_status",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const event = {};
    event.is_active = false;
    if (!req.body.is_active) {
      event.is_active = true;
    }
    Event.findByIdAndUpdate(req.body._id, { $set: event }, { new: true })
      .populate(["club", "eventType", "eventCategory"])
      .exec((err, event) => {
        if (err) throw err;

        res.json(event);
      });
  }
);

module.exports = router;
