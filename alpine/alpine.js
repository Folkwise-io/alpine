const requireAll = require('require-all');
const AlpineLibrary = require('./alpineLibrary');

const { getConfiguration } = require('../common/utils');

const Alpine = (config = getConfiguration()) => {
  const opts = {};

  // Get project configuration
  Object.assign(opts, config);

  // Require all the methods
  if (!opts.methods) {
    const methodDefinitions = requireAll({
      dirname: opts.methodsPath,
      filter: /(\w+)\.js$/,
      recursive: true,
    });

    Object.assign(opts, {
      methods: methodDefinitions,
    });
  }

  return AlpineLibrary(opts);
};

module.exports = Alpine;
