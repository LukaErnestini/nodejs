const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    title: "Add Product",
    path: "/admin/add-product",
  });
};

exports.getProductsAdmin = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      title: "All Products",
      path: "/admin/products",
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  console.log(price);
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      title: "All Products",
      path: "/products",
    });
  });
};
