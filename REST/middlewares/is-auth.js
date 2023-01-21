const jwt = require("jsonwebtoken");
const { jwt_pk } = require("../config");
const { throwError } = require("../util/errors");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1] || "unauthenticated";
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, jwt_pk);
  } catch (error) {
    console.log(error);
    throwError(401, "Unauthorized.");
  }
  req.userId = decodedToken.userId;
  next();
};
