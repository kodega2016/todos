const express = require("express");
const {
  login,
  register,
  me,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { auth } = require("../middleware/auth");
const { authValidation } = require("../validations/auth");
const router = express.Router();

router.route("/login").post(authValidation("login"), login);
router.route("/register").post(authValidation("register"), register);
router.route("/me").get(auth, me);
router
  .route("/forgot-password")
  .post(authValidation("forgotPassword"), forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

module.exports = router;
