const express = require("express");

const productsController = require("../controllers/products");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", productsController.getProducts);
router.get("/products/:productId", productsController.getProduct);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);
router.get("/orders", isAuth, shopController.getOrders);
router.post("/create-order", isAuth, shopController.postOrder);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);
router.get("/checkout", shopController.getCheckout);
router.post("/create-checkout-session", shopController.createCheckoutSession);
router.get("/checkout/cancel", shopController.getCheckout);
router.get("/checkout/success", shopController.getSuccess);

module.exports = router;
