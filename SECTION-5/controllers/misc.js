exports.get404 = (req, res, next) => {
  res.render("error", {
    title: 404,
    description: "Page not found.",
    path: "",
  });
};
