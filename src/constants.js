"use strict";

const path = require(`path`);

const DEFAULT_COMMAND = `--help`;
const DEFAULT_COUNT = 1;
const DEFAULT_PORT = 3000;
const USER_ARGV_INDEX = 2;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const MockFile = {
  NAME: path.resolve(__dirname, `../mocks.json`),
  ANNOUNCES_PATH: path.resolve(__dirname, `./service/data/announces.txt`),
  TITLES_PATH: path.resolve(__dirname, `./service/data/titles.txt`),
  CATEGORIES_PATH: path.resolve(__dirname, `./service/data/categories.txt`),
};

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_COUNT,
  DEFAULT_PORT,
  USER_ARGV_INDEX,
  MockFile,
  ExitCode,
  HttpCode,
};
