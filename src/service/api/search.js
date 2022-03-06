"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {

    if (
      req.query.constructor === Object &&
      Object.keys(req.query).length === 0
    ) {

      return res.status(HttpCode.BAD_REQUEST).send();
    }
    const query = req.query.query;
    const result = await service.findAll(query);
    if (result.length === 0) {
      return res.status(HttpCode.NOT_FOUND).send(result);
    }
    return res.status(HttpCode.OK).send(result);
  });
};
