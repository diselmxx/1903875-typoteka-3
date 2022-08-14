"use strict";

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const COUNT_commentS_ELEMENT = 4;

  const socket = io(SERVER_URL);

  const createcommentElement = (comment) => {

    const commentTemplate = document.querySelector("#comment-template");
    const commentElement = commentTemplate.cloneNode(true).content;

    commentElement.querySelector(".last__list-link").textContent = comment.text;
    commentElement
      .querySelector(".last__list-link")
      .setAttribute("href", `/articles/${comment.articleId}`);
    commentElement
      .querySelector(".last__list-image")
      .setAttribute('src', `/img/${comment.users.avatar}`);
    commentElement.querySelector(".last__list-name").textContent = comment.users.firstname;
    return commentElement;
  };

  const updatecommentsElements = (comment) => {
    const commentListElements = document.querySelector(".last__list");
    const commentElements = commentListElements.querySelectorAll("li");

    if (commentElements.length === COUNT_commentS_ELEMENT) {
      commentElements[commentElements.length - 1].remove();
    }

    commentListElements.prepend(createcommentElement(comment));
  };

  socket.addEventListener("comment:create", (comment) => {
    updatecommentsElements(comment);
  });
})();
