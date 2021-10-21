"use strict";

const { Router } = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) =>
  res.render(`my`, { wrapperClass: `wrapper wrapper--nobackground` })
);
myRouter.get(`/comments`, (req, res) =>
  res.render(`comments`, { wrapperClass: `wrapper wrapper--nobackground` })
);

module.exports = myRouter;
