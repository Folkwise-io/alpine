const requireAll = require('require-all');
const AlpineMethod = require('./method');

const { isRoot, getConfiguration } = require('../common/utils');

const Alpine = () => {
  const opts = {};

  // Get project configuration
  if (!isRoot()) {
    throw new Error('Invalid root.');
  }

  // Get project configuration
  Object.assign(opts, getConfiguration());

  // Require all the methods
  const methodMetas = requireAll({
    dirname: opts.methodsPath,
    filter: /(.+method)\.js$/,
    recursive: true,
  });

  // Build the library
  const library = {};
  Object.values(methodMetas).forEach((methodMeta) => {
    library[methodMeta.name] = AlpineMethod(methodMeta);
  });

  return library;
};

module.exports = Alpine;
