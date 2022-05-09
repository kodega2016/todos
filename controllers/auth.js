const { validationResult } = require("express-validator");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("./../models/User");

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");

    return next(new ErrorResponse(errorMessages, 400));
  }

  const { email, password } = req.body;

  res.status(200).json({
    data: null,
    message: "Login Successful",
    status: true,
  });
};
exports.register = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");

    return next(new ErrorResponse(errorMessages, 400));
  }

  const { name, email, password } = req.body;

  let user = await User.findOne({ email: email });

  if (user) {
    return next(new ErrorResponse("User already exists", 400));
  }

  user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    data: user,
    message: "Register Successful",
    status: true,
  });
};

exports.me = async (req, res, next) => {
  res.status(200).json({
    data: null,
    message: "Current User fetched successfully",
    status: true,
  });
};
