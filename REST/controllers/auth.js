const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { jwt_pk } = require("../config");
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

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email })
    .then((user) => {
      if (!user) throwError(401, "A user with this email could not be found.");
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual)
        throwError(401, "A user with this email could not be found.");
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        jwt_pk,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      next(err);
    });
};