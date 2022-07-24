"use strict";

const {Sequelize, Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);


class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findOne(id) {
    return await this._Article.findByPk(id);
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });
    return !!deletedRows;
  }

  async update(id, article) {
    const [updatedArticle] = await this._Article.update(article, {
      where: {id},
    });

    if (article.categories) {
      const art = await this._Article.findByPk(id);
      await art.setCategories(article.categories);
    }

    return !!updatedArticle;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
      });
    }

    const article = await this._Article.findAll({
      include,
      order: [[`createdAt`, `DESC`]],
    });

    return article.map((item) => item.get());
  }

  async findPage({limit, offset}, categoryId) {
    let where = {};
    if (categoryId) {
      where = {
        id: {
          [Op.in]: [
            Sequelize.literal(`(
                SELECT "ArticleId"
                FROM article_categories
                WHERE "article_categories"."CategoryId" = ${categoryId}
              )`
            ),
          ],
        },
      };
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      order: [[`createdAt`, `DESC`]],
      distinct: true,
      where
    });
    return {count, articles: rows};
  }

  async findPopular() {
    const article = await this._Article.findAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM comments
                    WHERE "comments"."articleId" = "Article"."id"
                )`),
            `commentscount`,
          ],
        ],
      },
      order: [[Sequelize.literal(`commentscount`), `DESC`]],
      limit: 4
    });

    return article.map((item) => item.get());
  }

}

module.exports = ArticleService;
