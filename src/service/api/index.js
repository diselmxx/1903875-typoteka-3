"use strict";

const {Router} = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const user = require(`./user`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  ArticleService,
  CategoryService,
  CommentService,
  SearchService,
  UserService
} = require(`../data-service/`);

const app = new Router();

defineModels(sequelize);

(async () => {

  category(app, new CategoryService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  search(app, new SearchService(sequelize));
  user(app, new UserService(sequelize), new CommentService(sequelize));
})();

module.exports = app;
