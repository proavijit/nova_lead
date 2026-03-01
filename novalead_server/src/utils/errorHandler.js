const logger = require('./logger');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  // Ensure CORS headers are present even in errors
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'https://novaleadclient.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');

  logger.error(message, {
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
