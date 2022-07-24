"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const auth = require(`../middlewares/auth`);
const {prepareErrors, formatDate} = require(`../utils`);
const myRouter = new Router();
const api = getAPI();
const ARTICLES_PER_PAGE = 8;


myRouter.get(`/`, auth, async (req, res, next) => {
  try {
    const {user} = req.session;
    let {page = 1} = req.query;
    page = +page;
    const limit = ARTICLES_PER_PAGE;
    const offset = (page - 1) * ARTICLES_PER_PAGE;
    const [{count, articles}] = await Promise.all([
      api.getArticles({limit, offset}),
    ]);
    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
    formatDate(articles);
    res.render(`my`, {
      wrapperClass: `wrapper wrapper--nobackground`,
      articles,
      page,
      totalPages,
      user,
    });
  } catch (error) {
    next(error);
  }
});

myRouter.get(`/categories`, async (req, res, next) => {
  try {
    const {user} = req.session;
    if (user && user.role === `author`) {
      const categories = await api.getCategories();
      res.render(`all-categories`, {
        categories,
        wrapperClass: `wrapper wrapper--nobackground`,
        user,
      });
    } else {
      res.redirect(`/404`);
    }
  } catch (error) {
    next(error);
  }
});

myRouter.post(`/categories/:id`, async (req, res) => {
  const {body} = req;
  const {id} = req.params;
  try {
    await api.updateCategory(body, id);
    res.redirect(`/my/categories`);
  } catch (error) {
    res.redirect(`/my/categories`);
  }
});

myRouter.post(`/categories`, async (req, res) => {
  const {body} = req;
  const {user} = req.session;
  try {
    await api.createCategory(body);
    res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(`all-categories`, {
      categories,
      validationMessages,
      user,
    });
  }
});

myRouter.get(`/comments`, auth, async (req, res, next) => {
  try {
    const {user} = req.session;

    if (user && user.role === `author`) {
      try {
        const comments = await api.getUserComments(user.id);
        res.render(`comments`, {
          comments,
          wrapperClass: `wrapper wrapper--nobackground`,
          user,
        });
      } catch (error) {
        res.redirect(`/404`);
      }
    } else {
      res.redirect(`/404`);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = myRouter;
