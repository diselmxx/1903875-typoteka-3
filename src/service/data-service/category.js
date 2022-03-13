"use strict";

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findOne(id) {
    return await this._Category.findByPk(id);
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [`id`, `title`, [Sequelize.fn(`COUNT`, `*`), `count`]],
        group: [Sequelize.col(`Category.id`)],
        include: [
          {
            model: this._ArticleCategory,
            as: Aliase.ARTICLE_CATEGORIES,
            attributes: [],
          },
        ],
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
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
}

module.exports = CategoryService;

