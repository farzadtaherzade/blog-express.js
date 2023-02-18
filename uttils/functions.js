const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
exports.hashString = (str) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(str, salt);
};

exports.verfyToken = (token) => {
  const result = jwt.verify(token, process.env.SECRET);
  return result;
};

exports.isAdmin = async (req) => {
  const authorization = req.headers?.authorization;
  if (!authorization) return false;
  const token = authorization.split(" ")[1];
  const result = this.verfyToken(token);
  const { username, email } = result;
  const user = await UserModel.findOne({ username, email });
  const role = user.role;
  if (role && role == "admin") return true;
  return false;
};
