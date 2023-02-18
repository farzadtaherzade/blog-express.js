const router = require("express").Router();
const { ArticleController } = require("../controllers/article.controllers");
const { articleValidator } = require("../middleware/articleValidate");
const { checkLogin } = require("../middleware/userLogin");
const upload = require("../uttils/multer");

router.get("/", articleValidator(), ArticleController.getAllArticle);
router.get("/:slug", articleValidator(), ArticleController.getArticle);
router.delete(
  "/delete-article/:slug",
  checkLogin,
  articleValidator(),
  ArticleController.deleteArticle
);
router.post(
  "/create-article",
  checkLogin,
  upload.single("cover"),
  articleValidator(),
  ArticleController.createArticle
);

module.exports = router;
