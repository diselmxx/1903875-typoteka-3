"use strict";

const { nanoid } = require(`nanoid`);
const { MAX_ID_LENGTH } = require(`../../constants`);
const { getRandomDate } = require(`../cli/utils`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object.assign(
      { id: nanoid(MAX_ID_LENGTH), createdDate: getRandomDate(), comments: [] },
      article
    );

    this._articles.push(newArticle);
    return newArticle;
  }

  drop(id) {
    const article = this._articles.find((item) => item.id === id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);
    return article;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, article) {
    const oldarticle = this._articles.find((item) => item.id === id);

    return Object.assign(oldarticle, article, { createdDate: getRandomDate() });
  }
}

module.exports = ArticleService;
