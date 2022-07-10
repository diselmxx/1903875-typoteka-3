"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const {getAPI} = require(`../api`);
const {upload} = require(`../middlewares/upload`);
const {prepareErrors} = require(`../utils`);
const api = getAPI();
const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  const {user} = req.session;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles, popular, lastComments}, categories] =
    await Promise.all([
      api.getArticles({limit, offset}),
      api.getCategories(true)
    ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {
    articles,
    page,
    totalPages,
    categories,
    user,
    popular,
    lastComments,
  });
});

mainRouter.get(`/register`, (req, res) => {
  const isRegisterPage = true;
  res.render(`sign-up`, {isRegisterPage});
});

mainRouter.get(`/login`, (req, res) => {
  const isLoginPage = true;
  res.render(`login`, {isLoginPage});
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  if (req.query.constructor === Object && Object.keys(req.query).length === 0) {
    res.render(`search`, {wrapperClass: `wrapper-color`});
  } else {
    const results = await api.search(req.query);
    res.render(`search`, {
      results,
      wrapperClass: `wrapper-color`,
      searchResultsEmpty: results.length === 0,
      query: req.query.query,
      user
    });
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

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(
        req.body.email,
        req.body.password
    );
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`login`, {user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});


module.exports = mainRouter;
