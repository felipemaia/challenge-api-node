const express = require('express');
const APIController = require('../../controllers/APIController');

const routes = express.Router();

/** PRIVATE endpoints */
/** RETRIEVE hole list of authors */
routes.get('/authors', APIController.getAuthors);

/** RETRIEVE one author by ID */
routes.get('/authors/:id', APIController.getAuthorById);

/** INSERT one author */
routes.post('/authors', APIController.insertAuthor);

/** UPDATE one author by ID */
routes.put('/authors/:id', APIController.updateAuthor);

/** DELETE one author by ID */
routes.delete('/authors/:id', APIController.deleteAuthorById);

/** RETRIEVE hole list of articles */
routes.get('/articles', APIController.getArticles);

/** INSERT one author */
routes.post('/articles', APIController.insertArticle);

/** UPDATE one author by ID */
routes.put('/articles/:id', APIController.updateArticle);

/** DELETE one article by ID */
routes.delete('/articles/:id', APIController.deleteArticleById);

module.exports = routes;