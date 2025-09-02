const express = require('express');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const authenticateToken = require('../middleware/auth');
const requestLogger = require('../middleware/requestLogger');

// API Routes
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');

const createServer = async (container) => {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  // Root route
  app.get('/', (req, res) => {
    res.json({ value: 'Hello world!' });
  });

  // API Routes
  app.use('/users', users(container));
  app.use('/authentications', authentications(container));
  app.use('/threads', threads(container, authenticateToken));
  app.use('/', comments(container, authenticateToken));

  // Error handling middleware
  app.use((err, req, res, next) => {   
    // Handle authentication errors
    if (err.statusCode === 401 || err.statusCode === 403) {
      return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
      });
    }
    
    const translatedError = DomainErrorTranslator.translate(err);

    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  return app;
};

module.exports = createServer;
