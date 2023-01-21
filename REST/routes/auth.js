const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const {
  emailSignup,
  emailLogin,
  password,
  name,
} = require("../middlewares/validators/auth");

router.put("/signup", [emailSignup, name, password], authController.signup);
router.post("/login", emailLogin, authController.login);

module.exports = router;
