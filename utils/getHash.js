const crypto = require("crypto");

exports.getHashFromString = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};
