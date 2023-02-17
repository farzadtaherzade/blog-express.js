const router = require("express").Router();
const { UserController } = require("../controllers/user.controllers");
const { checkLogin } = require("../middleware/userLogin");
const upload = require("../uttils/multer");

router.get("/me", checkLogin, UserController.getUserProfile);
router.patch(
  "/change-username",
  checkLogin,
  UserController.editProfileUsername
);
router.put("/change-password", checkLogin, UserController.changeUserPassword);
router.patch(
  "/upload-image",
  checkLogin,
  upload.single("photo"),
  UserController.uploaProfileImage
);

module.exports = router;
