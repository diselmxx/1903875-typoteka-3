"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, mockData) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    if (
      req.query.constructor === Object &&
      Object.keys(req.query).length === 0
    ) {
      return res.status(HttpCode.BAD_REQUEST).send();
    }
    const query = req.query.query;
    const result = mockData.filter((e) => e.title.includes(query));

    if (result.length === 0) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`По запросу "${query}" ничего не найдено`);
    }
    return res.status(HttpCode.OK).send(result);
  });
};
