"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorRegisterMessage = {
  FIRSTNAME: `Имя содержит некорректные символы`,
  LASTNAME: `Фамилия содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
};

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": ErrorRegisterMessage.EMAIL,
    "string.empty": ErrorRegisterMessage.EMAIL,
  }),
  firstname: Joi.string()
    .pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/)
    .required()
    .messages({
      "string.pattern.base": ErrorRegisterMessage.FIRSTNAME,
      "string.empty": ErrorRegisterMessage.FIRSTNAME,
    }),
  lastname: Joi.string()
    .pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/)
    .required()
    .messages({
      "string.pattern.base": ErrorRegisterMessage.LASTNAME,
      "string.empty": ErrorRegisterMessage.LASTNAME,
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": ErrorRegisterMessage.PASSWORD,
    "string.empty": ErrorRegisterMessage.PASSWORD,
  }),
  passwordRepeated: Joi.string()
    .required()
    .valid(Joi.ref(`password`))
    .required()
    .messages({
      "any.only": ErrorRegisterMessage.PASSWORD_REPEATED,
    }),
  avatar: Joi.string().allow(null, ``)
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(ErrorRegisterMessage.EMAIL_EXIST);
  }

  return next();
};
