const express = require("express");

const router = express.Router();

const isAuth = require("../middlewares/is-auth");
const authController = require("../controllers/auth");
const {
  emailSignup,
  emailLogin,
  password,
  name,
  status,
} = require("../middlewares/validators/auth");

router.put("/signup", [emailSignup, name, password], authController.signup);
router.post("/login", emailLogin, authController.login);
router.get("/status", isAuth, authController.getUserStatus);
router.patch("/status", isAuth, status, authController.updateUserStatus);

module.exports = router;
