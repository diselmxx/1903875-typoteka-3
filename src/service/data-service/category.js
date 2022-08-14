"use strict";

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);
const {Op} = require(`sequelize`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._Article = sequelize.models.Article;
  }

  async findOne(id) {
    return await this._Category.findByPk(id);
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [`id`, `title`, [Sequelize.fn(`COUNT`, `*`), `count`]],
        group: [Sequelize.col(`Category.id`)],
        order: [[`createdAt`, `DESC`]],
        include: [
          {
            model: this._ArticleCategory,
            as: Aliase.ARTICLE_CATEGORIES,
            attributes: [],
            where: {
              ArticleId: {
                [Op.ne]: null, // not null
              },
            },
          },
        ],
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({
        order: [[`createdAt`, `DESC`]],
        raw: true,
      });
    }
  }

  async findAllByArticleId(id) {
    return await this._Category.findAll({
      raw: true,
      attributes: [`id`, `title`],
      include: [
        {
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          required: true,
          where: {
            ArticleId: id,
          },
        },
      ],
    });
  }

  async update(id, category) {
    const [affectedRows] = await this._Category.update(category, {
      where: {id},
    });
    return !!affectedRows;
  }

  async create(category) {
    const newCategory = await this._Category.create(category);
    return newCategory.get();
  }

  async drop(id) {

    const relatedArticles = await this._ArticleCategory.findAll({where: {CategoryId: id}});

    if (relatedArticles.length === 0) {
      const deletedRows = await this._Category.destroy({
        where: {id},
      });
      return !!deletedRows;
    }

    return false;
  }
}

module.exports = CategoryService;

