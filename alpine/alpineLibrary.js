const AlpineMethod = require('./method');

const AlpineLibrary = (config = {}) => {
  const opts = {};

  // Assign project configuration
  Object.assign(opts, config);

  // Build the library
  const library = {};
  Object.values(opts.methods).forEach((methodDefinition) => {
    if (library[methodDefinition.name]) {
      throw new Error(`Duplicate: ${methodDefinition.name} has been defined more than once.`);
    }

    library[methodDefinition.name] = AlpineMethod(methodDefinition);
  });

  return library;
};

module.exports = AlpineLibrary;
