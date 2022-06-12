"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const auth = require(`../middlewares/auth`);
const myRouter = new Router();
const api = getAPI();
const ARTICLES_PER_PAGE = 8;


myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [{count, articles}] = await Promise.all([
    api.getArticles({limit, offset})
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`my`, {
    wrapperClass: `wrapper wrapper--nobackground`,
    articles,
    page,
    totalPages,
    user
  });
});

myRouter.get(`/categories`, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {
    categories,
    wrapperClass: `wrapper wrapper--nobackground`,
    user,
  });
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

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  const comments = articles.reduce((arr, article) => {
    arr.push(...article.comments);
    return arr;
  }, []);
  res.render(`comments`, {
    comments, wrapperClass: `wrapper wrapper--nobackground`,
  });
});

module.exports = myRouter;
