const ErrorResponse = require("../utils/ErrorResponse");

require("colors");

exports.auth = (req, res, next) => {
  console.log("Checking if user is logged in...".inverse.yellow);

  let token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    next(new ErrorResponse("Unauthenticated", 401));
  }

  next();
};

exports.authorize = (req, res, next) => {
  console.log("Checking if user is authorized...".inverse.yellow);
  next();
};
