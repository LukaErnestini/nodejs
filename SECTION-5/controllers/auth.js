const User = require("../models/user");

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
  User.findById("63c185182357e64ce239727e")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        // save is called to avoid redirecting, before the session is stored into the db
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
