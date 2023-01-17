exports.get404 = (req, res, next) => {
  res.status(404).render("error", {
    statusCode: 404,
    title: "Page not found",
    errMessage: "Page not found",
    path: "",
  });
};

exports.get500 = (req, res, next) => {
  res.render("error", {
    statusCode: 500,
    title: "Error",
    path: "",
  });
};
