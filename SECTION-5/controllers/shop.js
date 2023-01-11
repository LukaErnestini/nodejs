const Product = require("../models/product.js");

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        title: "Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.fetchById(prodId)
    .then((product) => {
      req.user.addToCart(product);
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
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((cartProducts) => {
      console.log(cartProducts[0].cartItem);
      return cartProducts[0].cartItem.destroy();
    })
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

  Product.fetchAll()
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
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        title: "Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((err) => {});
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  let cartProducts;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((p) => {
      cartProducts = p;
      return req.user.createOrder();
    })
    .then((createdOrder) => {
      return createdOrder.addProducts(
        cartProducts.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        })
      );
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
