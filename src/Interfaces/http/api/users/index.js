const express = require('express');
const UsersHandler = require('./handler');

module.exports = (container) => {
  const router = express.Router();
  const usersHandler = new UsersHandler(container);

  // User registration
  router.post('/', usersHandler.postUserHandler);

  return router;
};
