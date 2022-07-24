"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {
  articleExist,
  commentExist,
  commentValidator,
  articleValidator,
  routeParamsValidator,
} = require(`../middlewares/`);

module.exports = (app, ArticleService, CommentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit} = req.query;
    let [{count, articles}, lastComments, popular] = await Promise.all([
      ArticleService.findPage({limit, offset}),
      CommentService.findLast(),
      ArticleService.findPopular(),
    ]);
    res
      .status(HttpCode.OK)
      .json({count, articles, popular, lastComments});
  });

  route.get(`/:articleId`, routeParamsValidator, articleExist(ArticleService), async (req, res) => {
    const {article} = res.locals;
    const {categories} = req.query;
    const reqArticle = await ArticleService.findOne(article.id, categories);
    res.status(HttpCode.OK).json(reqArticle);
  });

  route.get(
      `/:articleId/comments`,
      routeParamsValidator,
      articleExist(ArticleService),
      async (req, res) => {
        const {article} = res.locals;
        const comments = await CommentService.findByArticleId(article.id);
        return res.status(HttpCode.OK).json(comments);
      }
  );

  route.post(
      `/:articleId/comments`,
      routeParamsValidator,
      articleExist(ArticleService),
      commentValidator,
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
      routeParamsValidator,
      articleExist(ArticleService),
      commentExist(CommentService),
      async (req, res) => {
        const {comment} = res.locals;
        await CommentService.drop(comment.id);

        return res.status(HttpCode.OK).send(`Комментарий удалён`);
      }
  );

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await ArticleService.create(req.body);
    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(
      `/:articleId`,
      routeParamsValidator,
      articleValidator,
      articleExist(ArticleService),
      async (req, res) => {
        const {article} = res.locals;
        const updatedArticle = await ArticleService.update(article.id, req.body);
        return res.status(HttpCode.OK).json(updatedArticle);
      }
  );

  route.delete(
      `/:articleId`,
      routeParamsValidator,
      articleExist(ArticleService),
      async (req, res) => {
        const {article} = res.locals;
        ArticleService.drop(article.id);
        return res.status(HttpCode.OK).send(article);
      }
  );
};
