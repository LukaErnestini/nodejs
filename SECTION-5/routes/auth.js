const express = require("express");
const { check, body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [body("email").isEmail().withMessage("Invalid email.").normalizeEmail()],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Invalid email.")
      .normalizeEmail()
      .custom((value, { req }) => {
        // if (value === "test@test.com")
        //   throw new Error("Example of custom validator triggered!");
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          // if this promise fulfils without error thrown, validator treats this as successful
          // this way we added our own async validation
          if (userDoc) {
            return Promise.reject("That email is already registered.");
          }
        });
      }),
    body(
      "password",
      "Password should be minimum 5 characters, only alphanumeric."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("password").custom((pass, { req }) => {
      if (pass !== req.body.confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/reset/:token", authController.postNewPassword);

module.exports = router;
