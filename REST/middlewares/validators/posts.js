const { check, body } = require("express-validator");

exports.title = body("title")
  .trim()
  .isLength({ min: 5 })
  .withMessage("Title must be less at least 5 characters");

exports.content = body("content")
  .trim()
  .isLength({ min: 5 })
  .withMessage("Title must be less at least 5 characters");

exports.image = check("file", "Image is required").not().exists();
