"use strict";

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const COUNT_commentS_ELEMENT = 4;

  const socket = io(SERVER_URL);



  const createcommentElement = (comment) => {

    const commentTemplate = document.querySelector("#comment-template");
    const commentElement = commentTemplate.cloneNode(true).content;

    commentElement.querySelector(".last__list-link").textContent = comment.text;
    return commentElement;
  };

  const updatecommentsElements = (comment) => {
    console.log(comment)
    // const commentsLastBlock = document.querySelector(".last__list");
    // // const commentListWrapperElement = commentsLastBlock.querySelector(
    // //   ".tickets-list__wrapper"
    // // );
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
