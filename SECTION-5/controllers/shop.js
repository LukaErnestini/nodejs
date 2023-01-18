const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");
const stripe = require("stripe")(
  "sk_test_51MRX0QC22pfUbSYJy4dJrrUzKGLUahoCQbVyZXfRRo096l92ovVm8RDf08PlYZdam9S5OGuvghgVoOv1PBJol9Ck0072xAlLAO"
);

const Product = require("../models/product.js");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log(user.cart);
      const existingItems = user.cart.items.filter(
        (item) => item.productId !== null
      );
      res.render("shop/cart", {
        title: "Cart",
        path: "/cart",
        products: existingItems,
      });
      if (existingItems !== user.cart.items) {
        console.log(
          "Purging nonexistent items in the cart of user " + req.user._id
        );
        req.user.cart.items = existingItems;
        return req.user.save();
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const products = user.cart.items;
    let total = 0;
    products.forEach((p) => {
      total += p.quantity * p.productId.price;
    });
    res.render("shop/checkout", {
      title: "Checkout",
      path: "/checkout",
      products,
      total,
    });
  });
};

exports.getSuccess = (req, res, next) => {
  req.user
    .createOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.createCheckoutSession = (req, res, next) => {
  const YOUR_DOMAIN = "http://localhost:3000";

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      const line_items = products.map((p) => {
        return {
          price_data: {
            product_data: {
              name: p.productId.title,
            },
            unit_amount: p.productId.price * 100,
            currency: "EUR",
          },
          quantity: p.quantity,
        };
      });
      return stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/checkout/success`,
        cancel_url: `${YOUR_DOMAIN}/checkout/cancel`,
      });
    })
    .then((session) => {
      res.redirect(303, session.url);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getIndex = (req, res, next) => {
  // console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(req.user)));
  const page = +req.query.page || 1;
  let totalProducts;
  Product.find()
    .countDocuments()
    .then((n) => {
      totalProducts = n;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        title: "Shop",
        path: "/index",
        totalProducts,
        prodsPerPage: ITEMS_PER_PAGE,
        hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        currentPage: page,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .populate("orders.orderId")
    .then((user) => {
      res.render("shop/orders", {
        title: "Orders",
        path: "/orders",
        orders: user.orders,
      });
    })
    .catch((err) => {});
};

exports.postOrder = (req, res, next) => {
  req.user
    .createOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) return next(new Error("No order found"));
      if (!order.user.userId.equals(req.user._id)) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
      if (fs.existsSync(invoicePath)) {
        const file = fs.createReadStream(invoicePath);
        return file.pipe(res);
      } else {
        console.log(`Invoice ${orderId} being created ...`);
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text("Invoice", { underline: true });
        pdfDoc.fontSize(12).text("-------------------");
        let total = 0;
        order.items.forEach((p) => {
          //pdfDoc.image(p.product.imageUrl, 50, pdfDoc.y, { width: 100 });
          pdfDoc.text(
            `${p.product.title} - ${p.quantity} x ${p.product.price} EUR`
          );
          total += p.quantity * p.product.price;
        });
        pdfDoc.fontSize(12).text("-------------------");
        pdfDoc.fontSize(18).text(`Total price: ${total} EUR`);

        pdfDoc.end();
      }
      // Reads whole file into memory. For bigger files this is not okay. We should be streaming. This is PRELOADING
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) return next(err);
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
      //   res.send(data);
      // });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
