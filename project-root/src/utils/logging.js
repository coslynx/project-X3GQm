const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

module.exports = {
  log: (level, message) => {
    logger.log(level, message);
  },
  error: (message) => {
    logger.error(message);
  },
  info: (message) => {
    logger.info(message);
  },
  debug: (message) => {
    logger.debug(message);
  },
  warn: (message) => {
    logger.warn(message);
  },
};