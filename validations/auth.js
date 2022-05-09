const { body } = require("express-validator");

exports.authValidation = (method) => {
  switch (method) {
    case "login": {
      return [
        body("email", "Invalid email").exists().isEmail(),
        body("password", "Password doesn't exists").exists(),
      ];
    }
    case "register": {
      return [
        body("name", "Name doesn't exists").exists(),
        body("email", "Invalid email").exists().isEmail(),
        body("password", "Password doesn't exists").exists(),
      ];
    }
  }
};
