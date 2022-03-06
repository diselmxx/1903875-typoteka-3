"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories(true),
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

mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {
    categories,
    wrapperClass: `wrapper wrapper--nobackground`,
  });
});

mainRouter.post(`/categories/:id`, async (req, res) => {
  const {body} = req;
  const {id} = req.params;
  try {
    await api.updateCategory(body, id);
    res.redirect(`/categories`);
  } catch (error) {
    res.redirect(`/categories`);
  }


});

module.exports = mainRouter;
