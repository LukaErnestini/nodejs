const express = require("express");

const router = express.Router();

const productsController = require("../controllers/products");

router.get("/add-product", productsController.getAddProduct);
router.get("/products", productsController.getProductsAdmin);
router.post("/add-product", productsController.postAddProduct);
router.get("/edit-product/:productId", productsController.getEditProduct);
router.post("/edit-product/:productId", productsController.postEditProduct);
router.post("/delete-product/:productId", productsController.postDeleteProduct);

module.exports = router;
