const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "18605c1fdfeb85",
    pass: "3433a6b1b5f34a",
  },
});

exports.getLogin = (req, res, next) => {
  //const isLoggedIn =
  //req.get("Cookie").split(";")[1].trim().split("=")[1] == "true";
  res.render("auth/login", {
    title: "Login",
    path: "/login",
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const validationError = validationResult(req).array()[0];
  const errorMessage = validationError ? validationError.msg : undefined;
  if (validationError) {
    return res.status(422).render("auth/login", {
      title: "Login",
      path: "/login",
      errorMessage: errorMessage,
      oldInput: { email, password },
      validationErrorParam: validationError ? validationError.param : undefined,
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).render("auth/login", {
          title: "Login",
          path: "/login",
          errorMessage: "Invalid email or password.",
          oldInput: { email, password },
        });
      }
      bcrypt.compare(password, user.password).then((equal) => {
        if (equal) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save((err) => {
            // save is called to avoid redirecting, before the session is stored into the db
            if (err) console.log(err);
            res.redirect("/");
          });
        }
        res.status(401).render("auth/login", {
          title: "Login",
          path: "/login",
          errorMessage: "Invalid email or password.",
          oldInput: { email, password },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    title: "Signup",
    path: "/signup",
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const validationError = validationResult(req).array()[0];
  const errorMessage = validationError ? validationError.msg : undefined;
  if (validationError) {
    return res.status(422).render("auth/signup", {
      title: "Signup",
      path: "/signup",
      errorMessage: errorMessage,
      oldInput: { email, password, confirmPassword },
      validationErrorParam: validationError ? validationError.param : undefined,
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        username: email,
        password: hashedPassword,
        cart: {
          items: [],
        },
        orders: [],
      });
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "shop@lukanodejs.com",
        subject: "Nice Nodemailer test",
        html: "<h1>You successfully signed up</h1>",
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    title: "Reset Password",
    path: "/reset",
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((user) => {
        const resetUrl = "localhost:3000/reset/" + user.resetToken;
        req.flash(
          "info",
          "An email with the link to reset the password has been dispatched."
        );
        res.redirect("/reset");
        transporter.sendMail({
          to: req.body.email,
          from: "shop@lukanodejs.com",
          subject: "Password reset requested",
          html: `
          <p>A request to reset the password of the account associated with this email has been made.</p>
          <p>Click this link to reset the password: <a href='${resetUrl}'>link</a></p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  res.render("auth/new-password", {
    title: "Reset Password",
    path: "/new-password",
    token: req.params.token,
  });
};

exports.postNewPassword = (req, res, next) => {
  newPassword = req.body.password;
  const token = req.params.token;
  User.findOne({
    // There is a very small chance that some other user's token was generated to be the same ...
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash(
          "error",
          "Invalid password reset request. Either timed out or wrong token."
        );
        return res.redirect("/reset");
      }
      return bcrypt
        .hash(newPassword, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          return user.save();
        })
        .then((user) => {
          req.flash(
            "info",
            "Password has been reset. You can now login with your new password."
          );
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
