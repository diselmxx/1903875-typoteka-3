"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const {getAPI} = require(`../api`);
const {upload} = require(`../middlewares/upload`);
const {prepareErrors} = require(`../utils`);
const api = getAPI();
const ARTICLES_PER_PAGE = 8;

// mainRouter.get(`/`, async (req, res) => {
//   const [articles, categories] = await Promise.all([
//     api.getArticles(),
//     api.getCategories(true),
//   ]);
//   res.render(`main`, {articles, categories});
// });

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories(true),
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {articles, page, totalPages, categories});
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

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    email: body.email,
    firstname: body.firstname,
    lastname: body.lastname,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
  };
  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {validationMessages});
  }
});


module.exports = mainRouter;
