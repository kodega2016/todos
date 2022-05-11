const { validationResult } = require("express-validator");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const sendMail = require("./../utils/sendMail");

const {
  getUserByEmail,
  createUser,
  getUserById,
  getUserByParams,
} = require("../services/auth");
const { getHashFromString } = require("../utils/getHash");

exports.login = asyncHandler(async (req, res, next) => {
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
  const user = await getUserByEmail(email);

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
});

exports.register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");

    return next(new ErrorResponse(errorMessages, 400));
  }

  const { name, email, password } = req.body;

  let user = await getUserByEmail(email);

  if (user) {
    return next(new ErrorResponse("User already exists", 400));
  }

  user = await createUser({ name, email, password });

  res.status(201).json({
    data: user,
    message: "Register Successful",
    status: true,
  });
});

exports.me = asyncHandler(async (req, res, next) => {
  const user = await getUserById(req.user.id);

  return res.status(200).json({
    data: user,
    message: "Current User fetched successfully",
    status: true,
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");
    return next(new ErrorResponse(errorMessages, 400));
  }

  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    return next(new ErrorResponse("User does not exist", 400));
  }

  const token = await user.getResetPasswordToken();

  const link = `${process.env.BASE_URL}/reset-password/${token}`;

  await sendMail({
    to: user.email,
    subject: "Reset Password",
    text: `Please click on the link to reset your password: ${link}`,
  });

  res.status(200).json({
    data: null,
    message: "Password reset email sent successfully.Please check your email",
    status: true,
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetPasswordToken = getHashFromString(token);

  const user = await getUserByParams({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Token is invalid or has expired", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    data: null,
    message: "Password reset successfully",
    status: true,
  });
});
