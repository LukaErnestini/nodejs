const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { throwError } = require("../util/errors");

exports.signup = (req, res, next) => {
  const error = validationResult(req).array()[0];
  if (error) throwError(422, "Validation failed.", { error });
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        email,
        name,
        password: hashedPass,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      next(err);
    });
};
