"use strict";

const axios = require(`axios`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  getArticles({offset, limit}) {
    return this._load(`/articles`, {params: {offset, limit}});
  }

  getArticlesByCategory({offset, limit}, categoryId) {
    return this._load(`/articles/category/${categoryId}`, {
      params: {offset, limit},
    });
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  getArticleComments(id) {
    return this._load(`/articles/${id}/comments`);
  }

  getUserComments(userId) {
    return this._load(`/user/comments`, {params: {userId}});
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: `POST`,
      data: {email, password},
    });
  }

  getCategoryById(categoryId) {
    return this._load(`/categories/${categoryId}`);
  }

  async search(query) {
    return this._load(`/search`, {params: query});
  }

  async getCategories(count, articleId) {
    return await this._load(`/categories`, {params: {count, articleId}});
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: `POST`,
      data,
    });
  }

  async createUser(data) {
    return await this._load(`/user`, {
      method: `POST`,
      data,
    });
  }

  async createComment(data, id) {
    return await this._load(`/articles/${id}/comments`, {
      method: `POST`,
      data,
    });
  }

  async deleteComment(articleId, commentId) {
    return await this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: `DELETE`,
    });
  }

  async deleteArticle(articleId) {
    return await this._load(`/articles/${articleId}`, {
      method: `DELETE`,
    });
  }

  async updateArticle(data, id) {
    const url = `/articles/${id}`;
    return await this._load(url, {
      method: `PUT`,
      data,
    });
  }

  async updateCategory(data, id) {
    const url = `/categories/${id}`;
    return await this._load(url, {
      method: `PUT`,
      data,
    });
  }

  async createCategory(data) {
    const url = `/categories`;
    return await this._load(url, {
      method: `POST`,
      data,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
}

const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;
const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
