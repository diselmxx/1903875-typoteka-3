"use strict";

const articleExist = require(`./articleExist`);
const categoryExist = require(`./categoryExist`);
const commentExist = require(`./commentExist`);
const commentValidator = require(`./comment-validator`);
const categoryValidator = require(`./category-validator`);
const articleValidator = require(`./article-validator`);
const objectValidator = require(`./objectValidator`);
const routeParamsValidator = require(`./route-params-validator`);

module.exports = {
  articleExist,
  categoryExist,
  articleValidator,
  categoryValidator,
  commentValidator,
  objectValidator,
  commentExist,
  routeParamsValidator,
};
