const Validator = require("validator");
const isEmpty = require("./is-empty");
const moment = require("moment");

module.exports = function validateAddEventInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? Validator.rtrim(data.title) : "";
  data.golfClub = !isEmpty(data.golfClub) ? data.golfClub : "";
  data.eventType = !isEmpty(data.eventType) ? data.eventType : "";
  data.eventCategory = !isEmpty(data.eventCategory) ? data.eventCategory : "";
  data.details = !isEmpty(data.details) ? data.details : "";

  if (JSON.parse(data.oneDayOnly)) {
    data.dateOfEvent = !isEmpty(data.dateOfEvent) ? data.dateOfEvent : "";
    if (!JSON.parse(data.isWholeDay)) {
      data.timeFrom = !isEmpty(data.timeFrom) ? data.timeFrom : "";
      data.timeTo = !isEmpty(data.timeTo) ? data.timeTo : "";
    }
  } else {
    data.from = !isEmpty(data.from) ? data.from : "";
    data.to = !isEmpty(data.to) ? data.to : "";
  }
  // -------------------------------
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title is required";
  }

  if (!Validator.isMongoId(data.golfClub)) {
    errors.golfClub = "Club is invalid";
  }

  if (Validator.isEmpty(data.golfClub)) {
    errors.golfClub = "Club is required";
  }

  if (Validator.isEmpty(data.eventType)) {
    errors.eventType = "Event Type is required";
  }

  if (!Validator.isMongoId(data.eventType)) {
    errors.eventType = "Event Type is invalid";
  }

  if (Validator.isEmpty(data.eventCategory)) {
    errors.eventCategory = "Event Category is required";
  }

  if (!Validator.isMongoId(data.eventCategory)) {
    errors.eventCategory = "Event Category is invalid";
  }

  if (JSON.parse(data.oneDayOnly)) {
    if (Validator.isEmpty(data.dateOfEvent)) {
      errors.dateOfEvent = "Date of Event is required";
    }
    if (!JSON.parse(data.isWholeDay)) {
      if (Validator.isEmpty(data.timeFrom)) {
        errors.timeFrom = "Time from is required.";
      }
      if (Validator.isEmpty(data.timeTo)) {
        errors.timeTo = "Time to is required";
      }
    }
  } else {
    if (Validator.isEmpty(data.from)) {
      errors.from = "Date from is required";
    }
    if (Validator.isEmpty(data.to)) {
      errors.to = "Date to is required";
    }
    if (Validator.isAfter(data.from, data.to)) {
      errors.to = "Date to must be greater than Date from.";
    }
    if (Validator.equals(data.from, data.to)) {
      errors.oneDayOnly =
        "You selected single date. Please specify this event as a 'one day only' event.";
    }
  }

  // if (
  //   !isEmpty(data.numberOfPlayers) &&
  //   !Validator.isNumeric(parseInt(data.numberOfPlayers))
  // ) {
  //   errors.numberOfPlayers =
  //     "Number of Players must contain numeric characters only.";
  // }

  // if (Validator.isEmpty(data.details)) {
  //   errors.details = "Event details is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
