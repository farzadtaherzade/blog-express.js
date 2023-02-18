const slugify = require("slugify");
const ArticleModel = require("../models/article");
const { isAdmin } = require("../uttils/functions");

class ArticleController {
  async createArticle(req, res, next) {
    try {
      const { title, desc } = req.body;
      const filename = req?.file?.filename;
      const userId = req.user._id;
      const slug = slugify(title);
      const result = await ArticleModel.create({
        title,
        desc,
        cover: filename,
        author: userId,
        slug,
      });
      if (!result)
        throw {
          status: 400,
          message: "There was a problem creating the article!",
        };
      return res.status(201).json({
        status: "sucess",
        result,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteArticle(req, res, next) {
    try {
      const slug = req?.params?.slug;
      const id = req.user._id;
      const role = req.user.role === "admin" ? true : false;

      const result = ArticleModel.findOneAndDelete({
        slug,
        author: role ? id : null,
      });
    } catch (error) {
      next(error);
    }
  }
  async getArticle(req, res, next) {
    try {
      const slug = req?.params?.slug;
      const role = req.user.role === "admin" ? true : false;
      const article = await ArticleModel.findOne({
        slug,
        author: role ? req.user._id : null,
      });
      if (!article)
        throw { status: 404, message: "Coudln't find your article" };
      // increment views
      article.views++;
      await article.save();

      return res.status(200).json({
        status: "sucess",
        article,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllArticle(req, res, next) {
    try {
      const articles = await ArticleModel.find(
        (await isAdmin(req)) ? {} : { status: "published" }
      );
      return res.status(200).json({
        status: "sucess",
        articles,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  ArticleController: new ArticleController(),
};
