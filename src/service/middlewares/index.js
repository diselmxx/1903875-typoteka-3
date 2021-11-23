"use strict";

const articleExist = require(`./articleExist`);
const commentExist = require(`./commentExist`);
const articleValidator = require(`./articleValidator`);

module.exports = {
  articleExist,
  articleValidator,
  commentExist,
};
