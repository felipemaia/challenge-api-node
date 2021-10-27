const express = require('express');
const APIController = require('../../controllers/APIController');

const routes = express.Router();

/** PUBLIC endpoints */
/** RETRIEVE token of logged user. It's a post due to security measures */
routes.post('/login', APIController.login);

/** INSERT new user if not exists */
routes.post('/sign-up', APIController.signup);

/** RETRIEVE list of articles based on the CATEGORY */
routes.get('/articles', APIController.getArticlesByCategory);

/** RETRIEVE one articles based on the ID */
routes.get('/articles/:id', APIController.getArticleById);


module.exports = routes;