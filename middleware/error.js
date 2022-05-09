require("colors");

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;

  let error = {};
  error.statusCode = statusCode;
  error.message = message;

  console.log("Error: ".red, error);

  res.status(error.statusCode || 500).json({
    success: false,
    data: null,
    message: error.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
