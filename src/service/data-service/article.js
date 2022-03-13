"use strict";

const Aliase = require(`../models/aliase`);
// const Sequelize = require(`sequelize`);

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
    // console.log(articleData);
    // const article = await this._Article.create(
    //     articleData,
    //     {
    //       include: [Aliase.CATEGORIES],
    //     }
    // );

    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });
    return !!deletedRows;
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id},
    });
    // look here https://www.codegrepper.com/code-examples/javascript/sequelize+update+association+include

    return !!affectedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const article = await this._Article.findAll({
      include,
      order: [[`createdAt`, `DESC`]],
    });

    return article.map((item) => item.get());
  }
}

module.exports = ArticleService;
