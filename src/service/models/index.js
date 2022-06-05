"use strict";

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const Aliase = require(`./aliase`);
const {Model} = require(`sequelize`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  User.hasMany(Article, {
    as: Aliase.ARTICLES,
    foreignKey: `userId`,
    onDelete: `cascade`,
  });

  User.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `userId`,
    onDelete: `cascade`,
  });

  Article.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`,
  });

  Article.belongsTo(User, {as: Aliase.USERS, foreignKey: `userId`});
  Comment.belongsTo(Article, {as: Aliase.ARTICLES, foreignKey: `articleId`});
  Comment.belongsTo(User, {as: Aliase.USERS, foreignKey: `userId`});

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

  return {Category, Article, User, Comment, ArticleCategory};
};

module.exports = define;
