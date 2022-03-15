"use strict";

const axios = require(`axios`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }


  getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
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
