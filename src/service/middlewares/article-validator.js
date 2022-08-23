"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 10 символов`,
  TITLE_MAX: `Заголовок не может содержать более 100 символов`,
  ANNOUNCE_MIN: `Аннонс содержит меньше 50 символов`,
  ANNOUNCE_MAX: `Аннонс не может содержать более 250 символов`,
  FULLTEXT_MIN: `Описание содержит меньше 50 символов`,
  FULLTEXT_MAX: `Описание не может содержать более 1000 символов`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  USER_ID: `Некорректный идентификатор пользователя`,
};

const schema = Joi.object({
  categories: Joi.array()
    .items(
        Joi.number().integer().positive().messages({
          "number.base": ErrorArticleMessage.CATEGORIES,
        })
    )
    .min(1)
    .required(),
  title: Joi.string().min(10).max(100).required().messages({
    "string.min": ErrorArticleMessage.TITLE_MIN,
    "string.max": ErrorArticleMessage.TITLE_MAX,
    "string.empty": `Заголовок должен быть заполнен`,
  }),
  picture: Joi.string().allow(null, ``),
  announce: Joi.string().min(5).max(1000).required().messages({
    "string.min": ErrorArticleMessage.ANNOUNCE_MIN,
    "string.max": ErrorArticleMessage.ANNOUNCE_MAX,
    "string.empty": `Aннонс должен быть заполнен`,
  }),
  fullText: Joi.string().min(5).max(1000).required().messages({
    "string.min": ErrorArticleMessage.FULLTEXT_MIN,
    "string.max": ErrorArticleMessage.FULLTEXT_MAX,
    "string.empty": `Описание должно быть заполнено`,
  }),
  userId: Joi.number().integer().positive().required().messages({
    "number.base": ErrorArticleMessage.USER_ID,
  }),
  createdAt: Joi.string().min(5).max(1000).messages({
    "string.empty": `Дата должна быть выбрана`,
  }),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    console.log(error);
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details);
  }

  return next();
};
