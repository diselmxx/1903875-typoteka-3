"use strict";

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment,
    });
  }

  async drop(id) {
    const deletedRows = this._Comment.destroy({
      where: {id},
    });
    return !!deletedRows;
  }

  findAll() {
    return this._Comment.findAll({
      order: [[`createdAt`, `DESC`]],
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: [`avatar`, `firstname`, `lastname`],
        },
      ],
    });
  }

  findByArticleId(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true,
      order: [[`createdAt`, `DESC`]],
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: [`avatar`, `firstname`],
        },
      ],
    });
  }

  findByUserId(userId) {
    return this._Comment.findAll({
      where: {userId},
      order: [[`createdAt`, `DESC`]],
      raw: true,
    });
  }

  findOne(id) {
    return this._Comment.findByPk(id);
  }
}

module.exports = CommentService;
