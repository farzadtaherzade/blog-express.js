const { UserModel } = require("../models/user");
const jwt = require("jsonwebtoken");

const checkLogin = async (req, res, next) => {
  try {
    const err = { status: 401, message: "please login to your account" };
    const authorization = req.headers.authorization;
    if (!authorization) throw err;
    const token = authorization.split(" ")[1];
    if (!token) throw err;
    const result = jwt.verify(token, process.env.SECRET);
    const { username } = result;
    if (!username) throw err;
    const user = await UserModel.findOne({ username });
    if (!user) throw err;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkLogin };
