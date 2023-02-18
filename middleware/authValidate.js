const { body } = require("express-validator");
const { UserModel } = require("../models/user");

function registerValidator() {
  return [
    body("username").custom(async (value, ctx) => {
      if (value) {
        const user = await UserModel.findOne({ username: value });
        if (user) throw "The username is duplicated";
        return true;
      } else {
        throw "Username can't be empty";
      }
    }),
    body("email")
      .isEmail()
      .withMessage("email not The entered is not correct")
      .custom(async (value, ctx) => {
        const user = await UserModel.findOne({ email: value });
        if (user) throw "email is already used";
        console.log("email");
        return true;
      }),
    body("password").notEmpty().withMessage("Password can't be empty"),
  ];
}
function loginValidator() {
  return [
    body("email")
      .isEmail()
      .withMessage("email not The entered email is not correct"),
    body("password").isLength({ min: 8 }),
  ];
}

module.exports = {
  registerValidator,
  loginValidator,
};
