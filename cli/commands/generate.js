const { red } = require('colors');
const { isRoot } = require('../../common/utils');

const methodGeneration = require('./method.generate');

module.exports = async ({ generationType, ...args }, options, logger) => {
  if (!isRoot()) {
    logger.error(red('You must be in the root of an Alpine project to run this command.'));
    process.exit(1);
  }

  switch (generationType.toLowerCase()) {
    case 'method':
      methodGeneration(args, options, logger);
      break;
    default:
      logger.error(red('Unknown generation type.'));
      process.exit(1);
  }
};
