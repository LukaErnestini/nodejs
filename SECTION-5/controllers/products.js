const fileHelper = require("../util/file");

const Product = require("../models/product");
const { validationResult } = require("express-validator");

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
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
      res.render("shop/product-list", {
        prods: products,
        title: "All Products",
        path: "/products",
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

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        title: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Add Product",
    path: "/admin/add-product",
    editing: "false",
  });
};

exports.getProductsAdmin = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProducts;
  Product.find({ userId: req.user._id })
    .countDocuments()
    .then((n) => {
      totalProducts = n;
      return Product.find({ userId: req.user._id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        title: "All Products",
        path: "/admin/products",
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

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  const userId = req.user;
  const validationError = validationResult(req).array()[0];
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      title: "Add Product",
      path: "/admin/add-product",
      editing: "false",
      oldInput: { title, image, description, price },
      errorMessage: "Attached file is not an image",
      validationErrorParam: validationError ? validationError.param : undefined,
    });
  }
  console.log(image);
  if (validationError) {
    const errorMessage = validationError ? validationError.msg : undefined;
    return res.status(422).render("admin/edit-product", {
      title: "Add Product",
      path: "/admin/add-product",
      editing: "false",
      oldInput: { title, description, price },
      errorMessage: errorMessage,
      validationErrorParam: validationError ? validationError.param : undefined,
    });
  }
  const imageUrl = image.path;
  const product = new Product({
    // _id: tempRemove.Types.ObjectId("63c25486cd3f0197677c919b"),
    title,
    price,
    description,
    imageUrl,
    userId,
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // return res.status(500).render("admin/edit-product", {
      //   title: "Add Product",
      //   path: "/admin/add-product",
      //   editing: "false",
      //   oldInput: { title, image, description, price },
      //   errorMessage: "Database operation failed, please try again",
      // });
      //res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        title: "Edit Product",
        path: "/admin/edit-product",
        product: product,
        editing: editMode,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  const prodId = req.params.productId;
  const validationError = validationResult(req).array()[0];
  if (validationError) {
    const errorMessage = validationError ? validationError.msg : undefined;
    return Product.findById(prodId)
      .then((product) => {
        res.status(422).render("admin/edit-product", {
          title: "Edit Product",
          path: "/admin/edit-product",
          product: product,
          editing: "true",
          oldInput: { title, description, price },
          errorMessage: errorMessage,
          validationErrorParam: validationError
            ? validationError.param
            : undefined,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  }
  Product.findById(prodId)
    .then((product) => {
      if (!product.userId.equals(req.user._id)) {
        console.log("Unauthorized edit attempt");
        return res.redirect("/");
      }
      product.title = title;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.description = description;
      product.price = price;
      return product.save().then(() => {
        console.log("Updated product");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.delete = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((prod) => {
      if (!prod) return next(new Error("Product not found"));
      fileHelper.deleteFile(prod.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then((result) => {
      if (result.deletedCount) {
        console.log("Destroyed product " + prodId);
        res.status(200).json({ message: "Success!" });
      } else {
        console.log(
          `User ${req.user._id} attempted to delete product ${prodId} but failed`
        );
        res.json({ message: "Deleting product failed." });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting product failed." });
    });
};
