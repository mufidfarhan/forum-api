const express = require('express');
const AuthenticationsHandler = require('./handler');

module.exports = (container) => {
  const router = express.Router();
  const authenticationsHandler = new AuthenticationsHandler(container);

  // Authentication routes
  router.post('/', authenticationsHandler.postAuthenticationHandler);     // Login
  router.put('/', authenticationsHandler.putAuthenticationHandler);       // Refresh token
  router.delete('/', authenticationsHandler.deleteAuthenticationHandler); // Logout

  return router;
};
