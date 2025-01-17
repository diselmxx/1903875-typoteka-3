"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const userValidator = require(`../middlewares/user-validator`);

const passwordUtils = require(`../lib/password`);

const route = new Router();

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`,
};

module.exports = (app, service, CommentService) => {
  app.use(`/user`, route);

  route.post(`/`, userValidator(service), async (req, res) => {
    const data = req.body;

    data.password = await passwordUtils.hash(data.password);

    const result = await service.create(data);

    delete result.password;

    res.status(HttpCode.CREATED).json(result);
  });

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;
    const user = await service.findByEmail(email);

    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
      return;
    }

    const passwordIsCorrect = await passwordUtils.compare(
        password,
        user.password
    );
    if (passwordIsCorrect) {
      delete user.password;
      res.status(HttpCode.OK).json(user);
    } else {
      res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
    }
  });

  route.get(`/comments`, async (req, res) => {
     const { userId } = req.query;
    try{
      const comments = await CommentService.findByUserId(userId);
      return res.status(HttpCode.OK).json(comments);
    }
    catch {
      console.log("User not found")
       return res.status(HttpCode.NOT_FOUND);
    }
  });
};
