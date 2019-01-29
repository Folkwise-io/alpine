const requireAll = require('require-all');
const AlpineMethod = require('./method');

const { getConfiguration } = require('../common/utils');

const Alpine = (config = getConfiguration()) => {
  const opts = {};

  // Get project configuration
  Object.assign(opts, config);

  // Require all the methods
  if (!opts.methods) {
    const methodDefinitions = requireAll({
      dirname: opts.methodsPath,
      filter: /(.+method)\.js$/,
      recursive: true,
    });

    Object.assign(opts, {
      methods: methodDefinitions,
    });
  }

  // Build the library
  const library = {};
  Object.values(opts.methods).forEach((methodDefinition) => {
    library[methodDefinition.name] = AlpineMethod(methodDefinition);
  });

  return library;
};

module.exports = Alpine;
