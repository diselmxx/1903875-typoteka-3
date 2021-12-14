"use strict";

const {HttpCode} = require(`../../constants`);

module.exports = (objKeys) => (req, res, next) => {
  const newItem = req.body;
  const keys = Object.keys(newItem);
  const keysExists = objKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  } else {
    next();
  }
};
