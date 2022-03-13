"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const myRouter = new Router();
const api = getAPI();
const ARTICLES_PER_PAGE = 8;


myRouter.get(`/`, async (req, res) => {
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
    articles, page, totalPages
  });
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
