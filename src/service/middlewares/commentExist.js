"use strict";

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (req, res, next) => {
  const {article} = res.locals;
  const {commentId} = req.params;
  const comment = service.findOne(commentId, article);

  if (!comment) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Comment with ${commentId} not found`);
  }

  res.locals.comment = comment;
  return next();
};
