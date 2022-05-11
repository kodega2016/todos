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

  //check if user exists
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("User does not exist", 400));
  }

  //Check if password is correct
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }

  //Generate JWT
  const token = user.getJsonWebToken();

  res.status(200).json({
    token: token,
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
  const user = await User.findById(req.user._id);

  return res.status(200).json({
    data: user,
    message: "Current User fetched successfully",
    status: true,
  });
};
