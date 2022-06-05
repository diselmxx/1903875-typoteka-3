"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const userValidator = require(`../middlewares/user-validator`);

const passwordUtils = require(`../lib/password`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/user`, route);

  route.post(`/`, userValidator(service), async (req, res) => {
    const data = req.body;

    data.password = await passwordUtils.hash(data.password);

    const result = await service.create(data);

    delete result.password;

    res.status(HttpCode.CREATED).json(result);
  });
};
