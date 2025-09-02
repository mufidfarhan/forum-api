const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const error = new Error('Missing authentication');
    error.statusCode = 401;
    return next(error);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err) {
      const error = new Error('Invalid token');
      error.statusCode = 403;
      return next(error);
    }
    req.auth = { credentials: { id: decoded.id } };
    next();
  });
};

module.exports = authenticateToken;