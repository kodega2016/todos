const express = require("express");
const { login, register, me } = require("../controllers/auth");
const { auth } = require("../middleware/auth");
const { authValidation } = require("../validations/auth");
const router = express.Router();

router.route("/login").post(authValidation("login"), login);
router.route("/register").post(authValidation("register"), register);
router.route("/me").get(auth, me);

module.exports = router;
