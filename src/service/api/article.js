"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {
  objectValidator,
  articleExist,
  commentExist,
} = require(`../middlewares/`);

const articleKeys = [`title`, `announce`, `fullText`, `categories`];
const commentKeys = [`text`];

module.exports = (app, ArticleService, CommentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await ArticleService.findAll(req.params);
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(ArticleService), async (req, res) => {
    const {article} = res.locals;
    const {categories} = req.query;
    const reqArticle = await ArticleService.findOne(article.id, categories);
    res.status(HttpCode.OK).json(reqArticle);
  });

  route.get(
      `/:articleId/comments`,
      articleExist(ArticleService),
      async (req, res) => {
        const {article} = res.locals;

        const comments = await CommentService.findAll(article.id);
        return res.status(HttpCode.OK).json(comments);
      }
  );

  route.post(
      `/:articleId/comments`,
      articleExist(ArticleService),
      objectValidator(commentKeys),
      async (req, res) => {
        const {article} = res.locals;
        const newComment = await CommentService.create(article.id, req.body);
        return res
        .status(HttpCode.CREATED)
        .json({id: newComment.id, text: newComment.text});
      }
  );

  route.delete(
      `/:articleId/comments/:commentId`,
      articleExist(ArticleService),
      commentExist(CommentService),
      async (req, res) => {
        // const {article, comment} = res.locals;
        const {comment} = res.locals;
        await CommentService.drop(comment.id);

        return res.status(HttpCode.OK).send(`Комментарий удалён`);
      }
  );

  route.post(`/`, objectValidator(articleKeys), async (req, res) => {
    const article = await ArticleService.create(req.body);
    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(
      `/:articleId`,
      [objectValidator(articleKeys), articleExist(ArticleService)],
      async (req, res) => {
        const {article} = res.locals;
        const updatedArticle = await ArticleService.update(article.id, req.body);
        return res.status(HttpCode.OK).json(updatedArticle);
      }
  );

  route.delete(
      `/:articleId`,
      articleExist(ArticleService),
      async (req, res) => {
        const {article} = res.locals;
        ArticleService.drop(article.id);

        return res.status(HttpCode.OK).send(article);
      }
  );
};
