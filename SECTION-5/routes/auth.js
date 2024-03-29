const express = require("express");
const {
  signupEmail,
  signupPassword,
  loginEmail,
} = require("../middleware/validators");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.post("/login", [loginEmail], authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [signupEmail, signupPassword],
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/reset/:token", authController.postNewPassword);

module.exports = router;
