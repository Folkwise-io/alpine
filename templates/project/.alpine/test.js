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

  Object.keys(tests).forEach(testFileName => {
    const name = testFileName.substring(0, testFileName.length - '.test'.length);
    const unitTest = tests[testFileName];
    describe(`#${name}()`, () => unitTest(library));
  });
});
