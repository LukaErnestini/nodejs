const Cart = require("../models/cart.js");

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    title: "Cart",
    path: "/cart",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout",
    path: "/checkout",
  });
};

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    title: "Index",
    path: "/index",
  });
};
