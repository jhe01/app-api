const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddUserInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.clubid = !isEmpty(data.clubid) ? data.clubid : "";
  data.roleid = !isEmpty(data.roleid) ? data.roleid : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 3, max: 30 })) {
    errors.name = "Name must be between 3 and 30 characters";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.clubid)) {
    errors.clubid = "Club is required";
  }
  if (!Validator.isMongoId(data.clubid)) {
    errors.clubid = "Club is Invalid";
  }
  if (Validator.isEmpty(data.roleid)) {
    errors.roleid = "Role is required";
  }
  if (!Validator.isMongoId(data.roleid)) {
    errors.roleid = "Role is invalid";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 16 })) {
    errors.password = "Password must be atleast 6 characters";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password is required";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Password not match!";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
