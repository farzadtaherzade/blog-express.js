const { UserModel } = require("../models/user");
const bcrypt = require("bcrypt");
const { hashString } = require("../uttils/functions");

class UserController {
  async getUserProfile(req, res, next) {
    try {
      const user = req.user;
      res.status(200).json({
        status: "sucess",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
  async editProfileUsername(req, res, next) {
    try {
      const id = req.user._id;
      const { username } = req.body;
      const result = UserModel.updateOne(
        { _id: id },
        { $set: { username: username } },
        (err, doc) => {
          if (err) throw err;
          return res.status(200).json({
            status: "sucess",
            message: "Profile successfully updated!",
          });
        }
      );
    } catch (error) {
      next(error);
    }
  }
  async changeUserPassword(req, res, next) {
    try {
      const user = req.user;
      const { currentPassword, newPassword, confirmNewPassword } = req.body;
      const resultComapre = bcrypt.compareSync(currentPassword, user.password);
      if (!resultComapre)
        throw { status: 401, message: "Your current password is wrong" };
      if (
        newPassword &&
        confirmNewPassword &&
        newPassword === confirmNewPassword
      ) {
        const hashPassword = hashString(newPassword);
        const result = UserModel.updateOne(
          { _id: user._id },
          { $set: { password: hashPassword } },
          (err, doc) => {
            if (err) throw err;
            return res.status(200).json({
              status: "sucess",
              message: "Your password successfully change",
            });
          }
        );
      }
    } catch (error) {
      next(error);
    }
  }
  async uploaProfileImage(req, res, next) {
    try {
      const id = req.user._id;
      const fileName = req.file.filename;
      const result = await UserModel.updateOne(
        { _id: id },
        {
          $set: { profile_image: fileName },
        },
        (err, doc) => {
          if (err) throw err;
          return res.status(200).json({
            status: "sucess",
            message: "Image sucessfully uploaded",
          });
        }
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  UserController: new UserController(),
};
