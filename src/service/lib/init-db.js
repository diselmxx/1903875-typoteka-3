"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);


module.exports = async (sequelize, {categories, articles, authors}) => {

  const {Category, Article, Author} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => {
        return {title: item};
      })
  );

  const authorModels = await Author.bulkCreate(
      authors.map((item) => ({...item}))
  );

  const categoryIdByName = categoryModels.reduce(
      (acc, next) => ({
        [next.title]: next.id,
        ...acc,
      }),
      {}
  );
  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {
      include: [Aliase.COMMENTS],
    });
    await articleModel.addCategories(
        article.category.map((title) => categoryIdByName[title])
    );
    // Todo set random authors
    await articleModel.setAuthor(authorModels[0]);
  });
  await Promise.all(articlePromises);
};
