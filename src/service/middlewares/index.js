"use strict";

const articleExist = require(`./articleExist`);
const categoryExist = require(`./categoryExist`);
const commentExist = require(`./commentExist`);
const objectValidator = require(`./objectValidator`);

module.exports = {
  articleExist,
  categoryExist,
  objectValidator,
  commentExist,
};
