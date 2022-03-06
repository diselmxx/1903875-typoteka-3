"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles, wrapperClass: `wrapper wrapper--nobackground`});
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
