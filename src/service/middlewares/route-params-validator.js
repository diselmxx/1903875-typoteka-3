"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  articleId: Joi.number().integer().min(1),
  commentId: Joi.number().integer().min(1),
  categoryId: Joi.number().integer().min(1),
});

module.exports = (req, res, next) => {
  const params = req.params;
  const {error} = schema.validate(params);

  if (error) {
    console.log(`route-params-validator error`);
    return res
      .status(HttpCode.NOT_FOUND)
      .send(error.details.map((err) => err.message).join(`\n`));
  }
  return next();
};
