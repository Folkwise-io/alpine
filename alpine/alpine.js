const requireAll = require('require-all');
const { META } = require('./common');

const Alpine = (libraryOptions) => {
  const defaultOptions = {
    methodsPath: '../methods',
    testsPath: '../tests',
  };
  const opts = Object.assign({}, defaultOptions, libraryOptions);

  // Require all the methods
  const alpineMethods = requireAll({
    dirname: opts.methodsPath,
    filter: /(.+method)\.js$/,
    recursive: true,
  });

  // Build the library
  const library = {};
  Object.values(alpineMethods).forEach((alpineMethod) => {
    const alpineMethodMeta = alpineMethod(META); // Get the method's meta data
    const { name } = alpineMethodMeta;
    library[name] = alpineMethod;
  });

  return library;
};

module.exports = Alpine;
