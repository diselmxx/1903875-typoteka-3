"use strict";

const { Router } = require(`express`);
const articlesRouter = new Router();

const getRouteId = (id) => Number.parseInt(id, 10);

articlesRouter.get(`/category/:id`, (req, res) => {
  res.send(`/articles/category/${getRouteId(req.params.id)}`);
});
articlesRouter.get(`/add`, (req, res) => res.send(`/articles/add`));
articlesRouter.get(`/edit/:id`, (req, res) => {
  res.send(`/articles/edit/${getRouteId(req.params.id)}`);
});
articlesRouter.get(`/:id`, (req, res) => {
  res.send(`/articles/${getRouteId(req.params.id)}`);
});

module.exports = articlesRouter;
