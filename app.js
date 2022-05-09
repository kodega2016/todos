const express = require("express");
const app = express();
const dotenv = require("dotenv");
const initDB = require("./config/initDB");
const morgan = require("morgan");
const auth = require("./routes/auth");
const errorHandler = require("./middleware/error");
require("colors");

//Load enviroment variables
dotenv.config({ path: "./config/config.env" });

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Database connection
initDB();

//Load Database models
require("./models/user");

//Morgan for logging
app.use(morgan("dev"));
//Routes
app.use("/auth", auth);
//Error handling
app.use(errorHandler);
//Server configuration
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (err, res) => {
  console.log(
    `Server is running in ${NODE_ENV} mode on port ${PORT}`.inverse.green
  );
});

process.on("unhandledRejection", async (err) => {
  await server.close();
  console.log("Server closed due to unhandled rejection".red);
  process.exit();
});
