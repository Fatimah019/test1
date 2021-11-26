import { apiCall } from "./api.js";
import { newsStorage } from "./storage.js";

let news_id = JSON.parse(localStorage.getItem("news_id"));
const news_page = document.querySelector("#news-page");

const getNewsById = async () => {
  const author_name = document.createElement("h1");
  news_page.appendChild(author_name);

  await apiCall.getRequest(`news/${news_id}`, (res) => {
    author_name.textContent = res.author;
  });
};

const getNewsImages = async () => {
  await apiCall.getRequest(`news/${news_id}/images`, (res) => {
    return res.map((data) => {
      const news_images_card = document.createElement("div");

      const news_image = document.createElement("img");
      news_image.src = data.image;

      news_page.appendChild(news_images_card);

      news_images_card.appendChild(news_image);
    });
  });
};

const getNewsCommentsById = async () => {
  const news_comments = document.querySelector("#news-comments");
  await apiCall.getRequest(`news/${news_id}/comments`, (res) => {
    return res.map((data) => {
      const comment_card = document.createElement("div");

      const author_name = document.createElement("h3");
      author_name.textContent = data.name;

      const author_image = document.createElement("img");
      author_image.src = data.avatar;

      const comment_text = document.createElement("input");
      comment_text.value = data.comment;

      const delete_comment_btn = document.createElement("button");
      delete_comment_btn.textContent = "Delete";

      news_comments.appendChild(comment_card);

      comment_card.appendChild(author_name);
      comment_card.appendChild(comment_text);
      comment_card.appendChild(author_image);
      comment_card.appendChild(delete_comment_btn);

      // delete a comment by its id
      delete_comment_btn.addEventListener("click", async (res) => {
        await newsStorage.setItemToLocalStorage("comment_to_del", res.id);
        // if (confirm(`Are you sure you want to delete it ?`)) {
        //   deleteComment(JSON.parse(localStorage.getItem("comment_to_del_to_del")), "comment deleted successfully");
        // } else {
        //   null;
        // }
      });
    });
  });
};

// delete a news by its id
const deleteComment = async (id, message) => {
  const news_id = localStorage.getItem("news_id");
  await apiCall.deleteRequest(`news/${news_id}/comments/${id}`, message);
};

// post a comment
const postComment = document.querySelector("#form-add-comments");
postComment.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(postComment).entries();
  await apiCall.postRequest(`news/${news_id}/comments`, formData, "Comment Added Successfully");
});

getNewsById();
getNewsImages();
getNewsCommentsById();
