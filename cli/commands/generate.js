const { red } = require('colors');

const methodGeneration = require('./method.generate');

module.exports = async ({ generationType, ...args }, options, logger) => {
  switch (generationType.toLowerCase()) {
    case 'method':
      methodGeneration(args, options, logger);
      break;
    default:
      logger.error(red('Unknown generation type.'));
      process.exit(1);
  }
};
