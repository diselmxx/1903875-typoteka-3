"use strict";

const fs = require(`fs`).promises;
const sequelize = require(`../lib/sequelize`);
const initDb = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `filldb`});

const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle,
  getRandomDate,
  getRandomSubarray,
} = require(`./utils`);
const {
  ExitCode,
  MockFile,
  DEFAULT_COUNT,
  MAX_COMMENTS,
  Roles,
} = require(`../../constants`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generatePublication = (
    count,
    titles,
    categories,
    announces,
    comments,
    users
) => {
  const randomSentencesNumber = getRandomInt(1, announces.length - 1);
  return Array(count)
    .fill({})
    .map(() => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      createdDate: getRandomDate(),
      announce: shuffle(announces).slice(1, 5).join(` `),
      fullText: shuffle(announces).slice(1, randomSentencesNumber).join(` `),
      category: getRandomSubarray(categories),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
      user: users[getRandomInt(0, users.length - 1)].email,
    }));
};

const generateComments = (count, comments, users) =>
  Array(count)
    .fill({})
    .map(() => ({
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
      user: users[getRandomInt(0, users.length - 1)].email,
    }));

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const mocksContent = await Promise.all([
      readContent(MockFile.TITLES_PATH),
      readContent(MockFile.CATEGORIES_PATH),
      readContent(MockFile.ANNOUNCES_PATH),
      readContent(MockFile.COMMENTS_PATH),
    ]);

    const users = [
      {
        email: `author@example.com`,
        firstname: `Author`,
        lastname: `A`,
        password: await passwordUtils.hash(`123456`),
        avatar: `ma9bRM5r6Z.png`,
        role: Roles[0],
      },
      {
        email: `reader@example.com`,
        firstname: `Reader`,
        lastname: `R`,
        password: await passwordUtils.hash(`123456`),
        avatar: `9D_JL-Sq7U.png`,
        role: Roles[2],
      },
    ];

    const [titles, categories, announces, comments] = [...mocksContent];

    const [count] = args;

    if (count > 1000) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const articles = generatePublication(
        countArticle,
        titles,
        categories,
        announces,
        comments,
        users
    );

    try {
      await initDb(sequelize, {categories, articles, users});
      console.info(chalk.green(`Operation success. Data base created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      console.error(chalk.red(`Can't create data base...`));
      console.error(err);
      process.exit(ExitCode.ERROR);
    }
  },
};
