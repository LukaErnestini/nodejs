const { check, body } = require("express-validator");
const User = require("../../models/user");

exports.email = body("email")
  .isEmail()
  .withMessage("Please enter a valid email.")
  .normalizeEmail()
  .custom((value, { req }) => {
    return User.findOne({ email: value })
      .then((userDoc) => {
        if (userDoc) return Promise.reject("Email already registered.");
      })
      .catch((err) => {
        next(err);
      });
  });

exports.password = body("password").trim().isLength({ min: 5 });
exports.name = body("name").trim().not().isEmpty();
