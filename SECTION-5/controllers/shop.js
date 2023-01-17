const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Product = require("../models/product.js");
const Order = require("../models/order");

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
