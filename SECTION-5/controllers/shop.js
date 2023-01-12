const Product = require("../models/product.js");

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        title: "Cart",
        path: "/cart",
        products: user.cart.items,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let productInCart;
  //     if (products.length > 0) {
  //       productInCart = products[0];
  //     }
  //     if (productInCart) {
  //       console.log("Product already in cart, increasing quantity");
  //       const oldQuantity = productInCart.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return productInCart;
  //     } else {
  //       return Product.findByPk(prodId);
  //     }
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     console.log("redirecting ...");
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout",
    path: "/checkout",
  });
};

exports.getIndex = (req, res, next) => {
  // console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(req.user)));

  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        title: "Shop",
        path: "/index",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log(orders[0].items[0]);
      res.render("shop/orders", {
        title: "Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((err) => {});
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
