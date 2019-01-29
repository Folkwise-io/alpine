const AlpineMethod = require('./method');

const AlpineBuild = (config = {}) => {
  const opts = {};

  // Get project configuration
  Object.assign(opts, config);

  // Build the library
  const library = {};
  Object.values(opts.methods).forEach((methodDefinition) => {
    library[methodDefinition.name] = AlpineMethod(methodDefinition);
  });

  return library;
};

module.exports = AlpineBuild;
