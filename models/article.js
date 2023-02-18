const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  cover: {
    type: String,
    required: true,
    trim: true,
  },
  desc: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
  },
  views: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["published", "draft"],
    default: "draft",
  },
});

const ArticleModel = mongoose.model("Article", articleSchema);

module.exports = ArticleModel;
