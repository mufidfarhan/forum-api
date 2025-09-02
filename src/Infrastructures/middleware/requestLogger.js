const requestLogger = (req, res, next) => {
  const timestamp = new Date().toLocaleString('id-ID');
  const method = req.method.padEnd(6);
  const url = req.url;
  const ip = (req.ip || req.connection.remoteAddress || '::1').replace('::ffff:', '');
  
  console.log(`🌐 ${timestamp} | ${method} | ${url} | ${ip}`);
  next();
};

module.exports = requestLogger;