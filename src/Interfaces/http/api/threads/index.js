const express = require('express');
const ThreadsHandler = require('./handler');

module.exports = (container, authenticateToken) => {
  const router = express.Router();
  const threadsHandler = new ThreadsHandler(container);

  // Thread routes
  router.post('/', authenticateToken, threadsHandler.postThreadHandler);
  router.get('/:threadId', threadsHandler.getThreadByIdHandler);

  return router;
};

