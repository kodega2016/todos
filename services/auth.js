const User = require("./../models/User");

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

exports.getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select("+password");
  return user;
};

exports.createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

exports.getUserByParams = async (params) => {
  const user = await User.findOne(params);
  return user;
};
