"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCategoryMessage = {
  TEXT: `Название категории содержит меньше 5 или больше 30 символов`,
};

const schema = Joi.object({
  title: Joi.string().min(5).max(30).required().messages({
    "string.min": ErrorCategoryMessage.TEXT,
    "string.max": ErrorCategoryMessage.TEXT,
    "string.empty": `Название категории не может быть пустым`,
  }),
});


module.exports = (req, res, next) => {
  const category = req.body;

  const {error} = schema.validate(category, {abortEarly: false});
  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
