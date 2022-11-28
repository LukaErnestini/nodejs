const express = require("express");

const productsController = require("../controllers/products");
const shopController = require("../controllers/shop");
const indexController = require("../controllers/index");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", productsController.getProducts);
router.get("/cart", shopController.getCart);
router.get("/checkout", shopController.getCheckout);

module.exports = router;
