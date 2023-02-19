const slugify = require("slugify");
const ArticleModel = require("../models/article");
const { isAdmin, unlinkCover } = require("../uttils/functions");

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
  async removeArticle(req, res, next) {
    try {
      const slug = req?.params?.slug;
      const userId = req.user._id;

      const article = await ArticleModel.findOne(
        isAdmin(req) ? { slug } : { slug, author: userId }
      );
      if (!article) throw { status: 404, message: "Article not founded" };
      unlinkCover(article.cover);

      const result = await ArticleModel.findOneAndDelete(
        isAdmin(req) ? { slug } : { slug, author: userId }
      );
      if (result.deletedCount == 0)
        throw { status: 400, message: "There is a problem to remove article" };
      return res.status(200).json({
        status: "success",
        message: "article successfully deleted!",
      });
    } catch (error) {
      next(error);
    }
  }
  async editArticle(req, res, next) {
    try {
      const slug = req?.params?.slug;
      const userId = req.user._id;
      const { title, desc, status } = req.body;
      const newSlug = slugify(title);
      const filename = req.file?.filename;

      const article = await ArticleModel.findOne(
        isAdmin(req) ? { slug } : { slug, author: userId }
      );
      if (!article) throw { status: 404, message: "Article not founded" };

      unlinkCover(article.cover);

      const result = await ArticleModel.findOneAndUpdate(
        isAdmin(req) ? { slug } : { slug, author: userId },
        {
          $set: { title, desc, status, slug: newSlug, cover: filename },
        }
      );
      if (result.modifiedCount == 0)
        throw {
          status: 400,
          message: "There was a problem updating the article",
        };
      return res.status(200).json({
        status: "success",
        message: "Updated",
      });
    } catch (error) {
      next(error);
    }
  }
  async getArticle(req, res, next) {
    try {
      const slug = req?.params?.slug;
      const article = await ArticleModel.findOne(
        (await isAdmin(req)) ? { slug } : { status: "published", slug }
      );
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
