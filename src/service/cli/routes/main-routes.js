"use strict";

const { Router } = require(`express`);
const { getFileContent } = require(`../utils`);
const mainRouter = new Router();

mainRouter.get(`/posts`, getFileContent);

module.exports = mainRouter;
