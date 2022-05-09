require("colors");
const mongoose = require("mongoose");
const ErrorResponse = require("../utils/ErrorResponse");

const initDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGOOSE_URL);
    console.log(`Connected to ${db.connection.name.cyan} database`.green);
  } catch (e) {
    throw new ErrorResponse(e);
  }

  console.log("Connected to the database".inverse.yellow);
};

module.exports = initDB;
