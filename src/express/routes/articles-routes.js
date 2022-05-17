"use strict";

const {Router} = require(`express`);
const articlesRouter = new Router();
const {getAPI} = require(`../api`);
const {upload} = require(`../multer`);
const {ensureArray, prepareErrors} = require(`../utils`);
const api = getAPI();


articlesRouter.get(`/category/:id`, (req, res) => {
  res.render(`articles-by-category`);
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`post`, {categories});
});

articlesRouter.post(`/add`, upload.single(`photo`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    picture: file ? file.filename : ``,
    announce: body.announce,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.categories),
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
    });
  }

});

articlesRouter.post(`/:id`, upload.single(`photo`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : ``,
    announce: body.announce,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.categories),
  };

  try {
    await api.updateArticle(articleData, id);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.post(
    `/:articleId/comments`,
    async (req, res) => {
      const {articleId} = req.params;
      try {
        await api.createComment(req.body, articleId);
        res.redirect(`back`);
      } catch (error) {
        res.redirect(`back`);
      }
    }
);

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(),
  ]);
  res.render(`post`, {article, categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories, comments] = await Promise.all([
    api.getArticle(id),
    api.getCategories(false, id),
    api.getArticleComments(id)
  ]);
  res.render(`post-detail`, {article, categories, comments});
});

module.exports = articlesRouter;
