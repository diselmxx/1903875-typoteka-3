"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {
  objectValidator,
  articleExist,
  commentExist,
} = require(`../middlewares/`);

const articleKeys = [`title`, `announce`, `fullText`, `category`];
const commentKeys = [`text`];

module.exports = (app, ArticleService, CommentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await ArticleService.findAll();
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(ArticleService), async (req, res) => {
    const {article} = res.locals;
    return res.status(HttpCode.OK).json(article);
  });

  route.get(
      `/:articleId/comments`,
      articleExist(ArticleService),
      async (req, res) => {
        const {article} = res.locals;

        const comments = CommentService.findAll(article);
        return res.status(HttpCode.OK).json(comments);
      }
  );

  route.post(
      `/:articleId/comments`,
      articleExist(ArticleService),
      objectValidator(commentKeys),
      async (req, res) => {
        const {article} = res.locals;
        const newComment = CommentService.create(req.body, article);
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
        const {article, comment} = res.locals;
        CommentService.drop(comment.id, article);

        return res.status(HttpCode.OK).send(`Комментарий удалён`);
      }
  );

  route.post(`/`, objectValidator(articleKeys), async (req, res) => {
    const article = ArticleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(
      `/:articleId`,
      [objectValidator(articleKeys), articleExist(ArticleService)],
      async (req, res) => {
        const {article} = res.locals;
        const updatedArticle = ArticleService.update(article.id, req.body);
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
