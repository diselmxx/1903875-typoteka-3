"use strict";

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineAuthor = require(`./author`);
const Aliase = require(`./aliase`);
const {Model} = require(`sequelize`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const Author = defineAuthor(sequelize);

  Author.hasMany(Article, {
    as: Aliase.ARTICLES,
    foreignKey: `authorId`,
    onDelete: `cascade`,
  });

  Author.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `authorId`,
    onDelete: `cascade`,
  });

  Article.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`,
  });

  Article.belongsTo(Author, {foreignKey: `authorId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});
  Comment.belongsTo(Author, {foreignKey: `authorId`});

  class ArticleCategory extends Model {}
  ArticleCategory.init({}, {sequelize, tableName: `article_categories`});

  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Aliase.CATEGORIES,
    // foreignKey: `categoryId`,
  });
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Aliase.ARTICLES,
    // foreignKey: `articleId`,
  });

  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});
  // Article.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {Category, Article, Author, Comment, ArticleCategory};
};

module.exports = define;
