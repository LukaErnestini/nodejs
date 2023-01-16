const { check, body } = require("express-validator");

// Validate the title field
exports.title = body("title")
  .not()
  .isEmpty()
  .withMessage("Title is required")
  .isLength({ max: 100 })
  .withMessage("Title must be less than 100 characters");

// Validate the image URL field
exports.imageURL = body("imageUrl")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Image URL is required")
  .isURL()
  .withMessage("Invalid image URL")
  .custom((value) => {
    if (
      !value.endsWith(".jpg") &&
      !value.endsWith(".jpeg") &&
      !value.endsWith(".png")
    ) {
      throw new Error("Image URL must end with .jpg, .jpeg or .png");
    }
    return true;
  });

// Validate the price field
exports.price = body("price")
  .not()
  .isEmpty()
  .withMessage("Price is required")
  .isNumeric()
  .withMessage("Price must be a number")
  .custom((value) => {
    if (value < 0) {
      throw new Error("Price must be greater than or equal to 0");
    }
    return true;
  });

// Validate the description field
exports.description = body("description")
  .not()
  .isEmpty()
  .withMessage("Description is required")
  .isLength({ max: 500 })
  .withMessage("Description must be less than 500 characters")
  .trim();
