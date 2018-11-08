const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddGolfCourseInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.clubid = !isEmpty(data.clubid) ? data.clubid : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Course Name is required";
  }
  if (Validator.isEmpty(data.clubid)) {
    errors.clubid = "Golf Club is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
