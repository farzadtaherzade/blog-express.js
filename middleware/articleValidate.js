const { body } = require("express-validator");
const path = require("path");

const articleValidator = () => {
  return [
    body("title").notEmpty().withMessage("The title can't be empty"),
    body("desc").notEmpty().withMessage("The description can't be empty"),
    body("cover")
      .notEmpty()
      .withMessage("You must select an image")
      .custom((value, { req }) => {
        const ext = path.extname(req.file.originalname).toLowerCase();
        const exts = [".jpg", ".png", ".jpeg", ".webp"];
        if (!ext.includes(exts))
          throw "Please upload an image Jpeg, Png, Jpg or Webp";
        const maxSize = 2 * 1024 * 1024;
        if (req.file.size > maxSize) throw "Image must lower than 2MB";
        return true;
      }),
  ];
};

module.exports = {
  articleValidator,
};
