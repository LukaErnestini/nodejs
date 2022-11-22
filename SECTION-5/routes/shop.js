const express = require("express");

const productsController = require("../controllers/products");
const cartController = require("../controllers/cart");
const indexController = require("../controllers/index");

const router = express.Router();

router.get("/", indexController.getIndex);
router.get("/products", productsController.getProducts);
router.get("/cart", cartController.getCart);
router.get("/cart", cartController.getCheckout);

module.exports = router;
