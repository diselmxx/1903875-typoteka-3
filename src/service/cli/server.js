"use strict";

const chalk = require(`chalk`);
const express = require(`express`);
const router = require(`./routes/router`);
const { HttpCode, DEFAULT_PORT } = require(`../../constants`);

module.exports = {
  name: `--server`,
  run(args) {
    const app = express();
    app.use(express.json());
    app.use(router);
    app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    app
      .listen(port)
      .on(`listening`, () => {
        console.info(chalk.green(`Ожидаю соединений на ${port}`));
      })
      .on(`error`, ({ message }) => {
        console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
      });
  },
};
