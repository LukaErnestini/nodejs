const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const { email, password, name } = require("../middlewares/validators/auth");

router.put("/signup", [email, name, password], authController.signup);

module.exports = router;
