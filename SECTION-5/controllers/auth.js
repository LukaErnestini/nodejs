const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  //const isLoggedIn =
  //req.get("Cookie").split(";")[1].trim().split("=")[1] == "true";
  res.render("auth/login", {
    title: "Login",
    path: "/login",
    //isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("No user with that email");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((equal) => {
        if (equal) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save((err) => {
            // save is called to avoid redirecting, before the session is stored into the db
            console.log(err);
            res.redirect("/");
          });
        }
        console.log("Invalid password");
        res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
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
  const confirmPass = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        console.log("That email is taken.");
        return res.redirect("/signup");
      }
      return bcrypt
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
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
