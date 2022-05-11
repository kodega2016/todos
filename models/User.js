const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: {
    type: String,
    default: "https://i.imgur.com/Xtqnx5A.png",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
  }

  next();
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.getJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_DATE,
  });
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
