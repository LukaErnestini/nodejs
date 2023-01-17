const express = require("express");
const {
  title,
  imageURL,
  price,
  description,
} = require("../middleware/validators");

const router = express.Router();

const productsController = require("../controllers/products");
const isAuth = require("../middleware/is-auth");

router.get("/add-product", isAuth, productsController.getAddProduct);
router.post(
  "/add-product",
  isAuth,
  [title, price, description],
  productsController.postAddProduct
);
router.get("/products", isAuth, productsController.getProductsAdmin);
router.get(
  "/edit-product/:productId",
  isAuth,
  productsController.getEditProduct
);
router.post(
  "/edit-product/:productId",
  isAuth,
  [title, price, description],
  productsController.postEditProduct
);
router.post(
  "/delete-product/:productId",
  isAuth,
  productsController.postDeleteProduct
);

module.exports = router;
