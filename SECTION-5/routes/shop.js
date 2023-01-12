const express = require("express");

const productsController = require("../controllers/products");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", productsController.getProducts);
router.get("/products/:productId", productsController.getProduct);
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
// router.post("/cart-delete-item", shopController.postCartDeleteProduct);
// router.get("/checkout", shopController.getCheckout);
// router.get("/orders", shopController.getOrders);
// router.post("/create-order", shopController.postOrder);

module.exports = router;
