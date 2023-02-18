const { UserModel } = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const checkLogin = asyncHandler(async (req, res, next) => {
  const err = { status: 401, message: "please login to your account" };
  const authorization = req.headers.authorization;
  if (!authorization) throw err;
  const token = authorization.split(" ")[1];
  if (!token) throw err;
  const result = jwt.verify(token, process.env.SECRET);
  const { username, email } = result;
  if (!username) throw err;
  const user = await UserModel.findOne({ username, email });
  if (!user) throw err;
  req.user = user;
  next();
});

module.exports = { checkLogin };
