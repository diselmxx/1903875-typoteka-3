"use strict";

const {Router} = require(`express`);
const articlesRouter = new Router();
const {getAPI} = require(`../api`);
const {upload} = require(`../multer`);
const auth = require(`../middlewares/auth`);
const {ensureArray, prepareErrors} = require(`../utils`);
const api = getAPI();
const csrf = require(`csurf`);
const csrfProtection = csrf();


articlesRouter.get(`/category/:id`, (req, res) => {
  const {user} = req.session;
  res.render(`articles-by-category`, {user});
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  if (user && user.role === `author`) {
    const categories = await api.getCategories();
    res.render(`post`, {categories, user, csrfToken: req.csrfToken()});
  } else {
    res.redirect(`/404`);
  }
});

articlesRouter.post(`/add`, auth, upload.single(`photo`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const articleData = {
    picture: file ? file.filename : ``,
    announce: body.announce,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.categories),
    userId: user.id,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(`post`, {
      categories,
      validationMessages,
      csrfToken: req.csrfToken(),
      user,
    });
  }

});

articlesRouter.post(`/:id`, auth, upload.single(`photo`), async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : ``,
    announce: body.announce,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.categories),
    userId: user.id,
  };

  try {
    await api.updateArticle(articleData, id, user);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.post(
    `/:articleId/comments`,
    async (req, res) => {
      const {articleId} = req.params;
      const {user} = req.session;
      try {
        await api.createComment({...req.body, userId: user.id}, articleId);
        res.redirect(`back`);
      } catch (error) {
        res.redirect(`back`);
      }
    }
);

articlesRouter.post(
    `/:articleId/comments/:commentId`,
    async (req, res) => {
      const {articleId, commentId} = req.params;
      try {
        await api.deleteComment(articleId, commentId);
        res.redirect(`back`);
      } catch (error) {
        res.redirect(`back`);
      }
    }
);

articlesRouter.get(`/edit/:id`, auth, async (req, res) => {
  const {user} = req.session;
  if (user && user.role === `author`) {
    const {id} = req.params;
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    res.render(`post`, {article, categories, user});
  } else {
    res.redirect(`/404`);
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [article, categories, comments] = await Promise.all([
    api.getArticle(id),
    api.getCategories(false, id),
    api.getArticleComments(id)
  ]);
  res.render(`post-detail`, {article, categories, comments, user});
});

module.exports = articlesRouter;
