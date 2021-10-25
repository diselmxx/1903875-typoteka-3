"use strict";

const { Router } = require(`express`);
const mainRouter = new Router();
const fs = require(`fs`).promises;
const { MockFile } = require(`../../../constants`);

const getFileContent = async (req, res) => {
  try {
    const fileContent = await fs.readFile(MockFile.NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (_err) {
    res.send([]);
  }
};

mainRouter.get(`/posts`, getFileContent);

module.exports = mainRouter;
