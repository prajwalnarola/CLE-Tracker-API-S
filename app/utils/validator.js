const { check, param, query } = require("express-validator");
// THIS IS VALIDATION FILE IN WHICH WE HAVE PUT ALL THE VALIDATION.
// HERE ARE THE ONLY FEW VALIDATIONS BUT IF MORE VALIDATIONS THE BEST PRACTISE IS TO CREATE DIFFRENT FILES FOR VALIDATIONS AND BIND IT IN ONE INDEX FILE.

exports.validateLogin = [
  check("email").isEmail().withMessage("email field is required with a valid email!"),
  check("password").notEmpty().withMessage("password field is required!"),
];

exports.validateRegister = [
  check("email").isEmail().withMessage("email field is required with a valid email!"),
  check("first_name").notEmpty().withMessage("first_name field is required!"),
  check("middle_name").notEmpty().withMessage("middle_name field is required!"),
  check("last_name").notEmpty().withMessage("last_name field is required!"),
  check("date_of_birth").notEmpty().withMessage("valid date_of_birth field is required!"),
  check("attorny_registration_number").notEmpty().withMessage("valid attorny_registration_number field is required!"),
  check("new_york_state_admission_date").notEmpty().withMessage("new_york_state_admission_date field is required!"),
  check("department_of_admission").notEmpty().withMessage("valid department_of_admission field is required!"),
  check("password").notEmpty().withMessage("password field is required!"),
  check("is_experienced").notEmpty().withMessage("is_experienced field is required!"),
];

exports.validateForgotPassword = [
  check("email").isEmail().withMessage("email field is required with a valid email!")
];

exports.validateChangePassword = [
  check("old_password").notEmpty().withMessage("old_password field is required!"),
  check("new_password").notEmpty().withMessage("new_password field is required!")
];