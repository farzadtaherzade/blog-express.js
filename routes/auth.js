const { AuthController } = require("../controllers/auth.controllers");
const router = require("express").Router();
const {
  registerValidator,
  loginValidator,
} = require("../middleware/authValidate");
const { checkValidaionErr } = require("../middleware/checkError");

router.post(
  "/signup",
  registerValidator(),
  checkValidaionErr,
  AuthController.signUp
);
router.post(
  "/login",
  loginValidator(),
  checkValidaionErr,
  AuthController.login
);

module.exports = router;
