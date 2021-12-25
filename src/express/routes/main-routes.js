"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories(),
  ]);
  res.render(`main`, {articles, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  if (req.query.constructor === Object && Object.keys(req.query).length === 0) {
    res.render(`search`, {wrapperClass: `wrapper-color`});
  } else {
    const results = await api.search(req.query);
    res.render(`search`, {
      results,
      wrapperClass: `wrapper-color`,
      searchResultsEmpty: results.length === 0,
      query: req.query.query
    });
  }
});

mainRouter.get(`/categories`, (req, res) =>
  res.render(`all-categories`, {
    wrapperClass: `wrapper wrapper--nobackground`,
  })
);

module.exports = mainRouter;
