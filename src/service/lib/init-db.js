"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);


module.exports = async (sequelize, {categories, articles, users}) => {

  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => {
        return {title: item};
      })
  );

  // const userModels = await User.bulkCreate(
  //     users.map((item) => ({...item}))
  // );

  // --------------------------

  const userModels = await User.bulkCreate(users, {
    include: [Aliase.ARTICLES, Aliase.COMMENTS],
  });

  const userIdByEmail = userModels.reduce(
      (acc, next) => ({
        [next.email]: next.id,
        ...acc,
      }),
      {}
  );

  articles.forEach((article) => {
    article.userId = userIdByEmail[article.user];
    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  // --------------------------

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
    // await articleModel.setUsers(userModels[0]);
  });
  await Promise.all(articlePromises);
};
