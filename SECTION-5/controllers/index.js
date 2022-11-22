exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    title: "Index",
    path: "/index",
    productsCSS: true,
  });
};
