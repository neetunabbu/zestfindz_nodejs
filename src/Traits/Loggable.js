const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
    new winston.transports.Console() // Optional: log to console for development
  ]
});

// Mixin to provide error logging functionality
const Loggable = {
  // Log error details
  error: (error) => {
    logger.error(error.message, {
      code: error.code || 0,
      message: error.message,
      file: error.fileName || 'unknown',
      line: error.lineNumber || 'unknown'
    });
  }
};

module.exports = Loggable;