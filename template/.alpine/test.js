const requireAll = require('require-all');
const cfg = require('../alpine.conf');
const library = require('../');

const { libraryName, testsPath } = cfg;

describe(libraryName, () => {
  const tests = requireAll({
    dirname: testsPath,
    filter: /(.+test)\.js$/,
    recursive: true,
  });

  Object.values(tests).forEach(test => test(library));
});
