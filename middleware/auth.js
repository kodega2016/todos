const ErrorResponse = require("../utils/ErrorResponse");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("colors");

exports.auth = async (req, res, next) => {
  let token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new ErrorResponse("Unauthenticated", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    req.user = user;
    return next();
  } catch (e) {
    return next(new ErrorResponse("Unauthenticated", 401));
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
