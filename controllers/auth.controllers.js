const { UserModel } = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { hashString } = require("../uttils/functions");
class AuthController {
  async signUp(req, res, next) {
    try {
      const { username, password, email } = req.body;
      const hashPassword = hashString(password);
      const user = await UserModel.create({
        username,
        password: hashPassword,
        email,
      }).catch((err) => {
        if (err) throw { status: 400, message: err };
      });
      return res.status(200).json({
        status: "success",
        user,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { password, email } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) throw { status: 401, message: "Email or Password is wrong" };
      const resultComapre = bcrypt.compareSync(password, user.password);
      if (!resultComapre)
        throw { status: 401, message: "Email or Password is wrong" };
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        process.env.SECRET,
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      await user.save();
      return res.status(200).json({
        status: "sucess",
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(){}
}

module.exports = {
  AuthController: new AuthController(),
};
