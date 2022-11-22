const Cart = require("../models/cart.js");

exports.getCart = (req, res, next) => {
  res.render("/shop/cart", {
    title: "Cart",
    path: "/cart",
    productsCSS: true,
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("/shop/checkout", {
    title: "Checkout",
    path: "/checkout",
    productsCSS: true,
  });
};
