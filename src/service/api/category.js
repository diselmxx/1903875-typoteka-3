"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();
const {
  categoryExist,
  categoryValidator
} = require(`../middlewares/`);

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count = false, articleId} = req.query;
    const categories = articleId
      ? await service.findAllByArticleId(articleId)
      : await service.findAll(count);
    return res.status(HttpCode.OK).json(categories);
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    const category = await service.create(req.body);
    return res.status(HttpCode.CREATED).json(category);
  });


  route.put(`/:categoryId`, categoryExist(service),
      async (req, res) => {
        const {category} = res.locals;
        const updatedCategory = await service.update(category.id, req.body);
        return res.status(HttpCode.OK).json(updatedCategory);
      }
  );
};
