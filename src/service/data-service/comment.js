"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  create(comment, article) {
    const newComment = Object.assign(
        {id: nanoid(MAX_ID_LENGTH), text: ``},
        comment
    );

    article.comments.push(newComment);
    return newComment;
  }

  drop(id, article) {
    const comments = this.findAll(article);
    const comment = this.findOne(id, article);

    if (!comment) {
      return null;
    }

    article.comments = comments.filter((item) => item.id !== id);
    return comment;
  }

  findAll(article) {
    return article.comments;
  }

  findOne(id, article) {
    return article.comments.find((item) => item.id === id);
  }
}

module.exports = CommentService;
