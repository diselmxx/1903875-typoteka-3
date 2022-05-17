
"use strict";

const ensureArray = (value) => (Array.isArray(value) ? value : [value]);

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

module.exports = {
  ensureArray,
  prepareErrors,
};
