"use strict";

const {Router} = require(`express`);
const articlesRouter = new Router();
const {getAPI} = require(`../api`);
const {upload} = require(`../multer`);
const auth = require(`../middlewares/auth`);
const {ensureArray, prepareErrors, formatDate} = require(`../utils`);
const api = getAPI();
const csrf = require(`csurf`);
const csrfProtection = csrf();
const ARTICLES_PER_PAGE = 8;

articlesRouter.get(`/category/:id`, async (req, res, next) => {
  try {
    let {page = 1} = req.query;
    const {user} = req.session;
    const {id: currentCategoryId} = req.params;
    page = +page;
    const limit = ARTICLES_PER_PAGE;
    const offset = (page - 1) * ARTICLES_PER_PAGE;

    const [{count, articles}, categories, currentCategory] =
      await Promise.all([
        api.getArticlesByCategory({limit, offset}, currentCategoryId),
        api.getCategories(true),
        api.getCategoryById(currentCategoryId),
      ]);
    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
    formatDate(articles);
    console.log(currentCategory);
    res.render(`articles-by-category`, {
      articles,
      page,
      totalPages,
      categories,
      user,
      currentCategory,
      currentCategoryId,
    });
  } catch (error) {
    next(error);
  }
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res, next) => {
  try {
    const {user} = req.session;
    if (user && user.role === `author`) {
      const categories = await api.getCategories();
      res.render(`post`, {categories, user, csrfToken: req.csrfToken()});
    } else {
      res.redirect(`/404`);
    }
  } catch (error) {
    next(error);
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
    createdAt: body.createdAt
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const valErrors = errors.response.data;
    const validationMessages = errors.response.data.map((err) => err.message);
    const categories = await api.getCategories();
    res.render(`post`, {
      categories,
      validationMessages,
      csrfToken: req.csrfToken(),
      user,
      valErrors,
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
    createdAt: body.createdAt,
  };

  try {
    await api.updateArticle(articleData, id, user);
    res.redirect(`/my`);
  } catch (errors) {
    const valErrors = errors.response.data;
    const validationMessages = errors.response.data.map((err) => err.message);
    if (user && user.role === `author`) {
      const [article, categories] = await Promise.all([
        api.getArticle(id),
        api.getCategories(),
      ]);
      res.render(`post`, {
        article,
        categories,
        validationMessages,
        user,
        valErrors,
      });
    }
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
      } catch (errors) {
        req.session.commentErrors = prepareErrors(errors);
        req.session.save();
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
      } catch (errors) {
        res.redirect(`back`);
      }
    }
);

articlesRouter.post(`/delete/:articleId`, async (req, res) => {
  const {articleId} = req.params;
  try {
    await api.deleteArticle(articleId);
    res.redirect(`back`);
  } catch (errors) {
    res.redirect(`back`);
  }
});

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

articlesRouter.get(`/:id`, async (req, res, next) => {
  try {
    const {user, commentErrors} = req.session;
    req.session.commentErrors = false;
    req.session.save();
    const {id} = req.params;
    const [article, categories, comments] = await Promise.all([
      api.getArticle(id),
      api.getCategories(false, id),
      api.getArticleComments(id),
    ]);
    formatDate(article);
    formatDate(comments, `DD.MM.YYYY, hh:mm`);
    res.render(`post-detail`, {
      article,
      categories,
      comments,
      user,
      commentErrors,
    });

  } catch (error) {
    next(error);
  }
});

module.exports = articlesRouter;
