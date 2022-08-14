"use strict";

const dayjs = require(`dayjs`);

const ensureArray = (value) => (Array.isArray(value) ? value : [value]);

const prepareErrors = (errors) => {
  return errors.data ? errors.response.data.split(`\n`) : false;
};

const formatDate = (arr, format = `DD.MM.YYYY`) => {
  return Array.isArray(arr)
    ? arr.forEach((item) => (item.createdAt = dayjs(item.createdAt).format(format)))
    : (arr.createdAt = dayjs(arr.createdAt).format(format));
};

module.exports = {
  ensureArray,
  prepareErrors,
  formatDate,
};
