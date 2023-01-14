exports.getLogin = (req, res, next) => {
  //const isLoggedIn =
  //req.get("Cookie").split(";")[1].trim().split("=")[1] == "true";
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    title: "Login",
    path: "/login",
    //isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};
